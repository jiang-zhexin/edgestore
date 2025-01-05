import { getRequestContext } from '@cloudflare/next-on-pages'

import { toMyFile } from "./common"
import { deleteFiles, getFiles, insertFiles, updateFiles } from "./db"
import { Sync } from "./store"

export const runtime = 'edge'

export async function GET(req: Request) {
    const { env } = getRequestContext()

    const response = await env.store.fetch(req.url)
    return new Response(response.body, response)
}

export async function PUT(req: Request) {
    const { env, ctx } = getRequestContext()

    if (req.headers.get("Authorization") !== `Bearer ${env.token}`) {
        return new Response("Forbidden", { status: 403 })
    }

    const [newFile, existFiles] = await Promise.all([toMyFile(req), getFiles(env)])
    const syncFiles = existFiles.filter((f) => f.path !== newFile.path).concat(newFile)

    await Sync(env, syncFiles)

    const header = new Headers()
    header.set("Content-Location", req.url)
    if (syncFiles.length > existFiles.length) {
        ctx.waitUntil(insertFiles(env, newFile))
        header.set("Location", req.url)
        return new Response("201 Created", {
            status: 201,
            headers: header
        })
    }
    ctx.waitUntil(updateFiles(env, newFile))
    return new Response(null, {
        status: 204,
        headers: header
    })
}

export async function DELETE(req: Request) {
    const { env, ctx } = getRequestContext()

    if (req.headers.get("Authorization") !== `Bearer ${env.token}`) {
        return new Response("Forbidden", { status: 403 })
    }

    const { pathname, searchParams } = new URL(req.url)

    const existFiles = await getFiles(env)
    const removeFiles = existFiles.filter((f) => f.path === pathname)

    if (removeFiles.length === 0) {
        return new Response("404 Not Found", { status: 404 })
    }

    if (searchParams.get("lazy") === "false") {
        const syncFiles = existFiles.filter((f) => f.path !== pathname)
        await Sync(env, syncFiles)
    }
    ctx.waitUntil(deleteFiles(env, ...removeFiles))
    return new Response(null, { status: 204 })
}