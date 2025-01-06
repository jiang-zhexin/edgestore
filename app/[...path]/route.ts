import { Hono } from "hono"
import { bearerAuth } from "hono/bearer-auth"
import { bodyLimit } from "hono/body-limit"
import { cors } from "hono/cors"
import { createMiddleware } from "hono/factory"
import { handle } from "hono/vercel"

import { getRequestContext } from "@cloudflare/next-on-pages"

import { toMyFile } from "@/utils/common"
import { deleteFiles, getFiles, insertFiles, updateFiles } from "@/utils/db"
import { Sync } from "@/utils/store"

export const runtime = "edge"

const app = new Hono()

app.get(
    "*",
    async (c, next) => {
        await next()
        c.header("cache-control", "public, max-age=604800, immutable")
    },
    cors({
        origin: "*",
        allowMethods: ["GET"],
        maxAge: 604800,
    }),
    async (c) => {
        const { env } = getRequestContext()

        const response = await env.store.fetch(c.req.url)
        return new Response(response.body, response)
    }
)

const BearerAuthMiddleware = createMiddleware(
    bearerAuth({
        realm: "Your Token",
        verifyToken: (token, c) => token === getRequestContext().env.token,
        noAuthenticationHeaderMessage: (c) => c.text("401 Unauthorized", 401),
        invalidAuthenticationHeaderMessage: (c) => c.text("401 Unauthorized", 401),
        invalidTokenMessage: (c) => c.text("403 Forbidden", 403),
    })
)

app.put(
    "*",
    BearerAuthMiddleware,
    bodyLimit({
        maxSize: 25 * 1024 * 1024,
        onError: (c) => {
            return c.text("413 Content Too Large", 413)
        },
    }),
    async (c) => {
        const { env, ctx } = getRequestContext()

        const [newFile, existFiles] = await Promise.all([toMyFile(c.req.raw), getFiles(env)])
        const syncFiles = existFiles.filter((f) => f.path !== newFile.path).concat(newFile)

        await Sync(env, syncFiles)

        c.header("Content-Location", c.req.url)
        if (syncFiles.length > existFiles.length) {
            ctx.waitUntil(insertFiles(env, newFile))
            c.header("Location", c.req.url)
            return c.text("201 Created", 201)
        }
        ctx.waitUntil(updateFiles(env, newFile))
        return c.newResponse(null, 204)
    }
)

app.delete("*", BearerAuthMiddleware, async (c) => {
    const { env, ctx } = getRequestContext()

    const existFiles = await getFiles(env)
    const removeFiles = existFiles.filter((f) => f.path === c.req.path)

    if (removeFiles.length === 0) {
        return c.text("404 Not Found", 404)
    }

    if (c.req.query("lazy") === "false") {
        const syncFiles = existFiles.filter((f) => f.path !== c.req.path)
        await Sync(env, syncFiles)
    }
    ctx.waitUntil(deleteFiles(env, ...removeFiles))
    return c.newResponse(null, 204)
})

export const GET = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
