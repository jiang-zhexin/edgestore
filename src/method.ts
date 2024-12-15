import { toMyFile } from "./common"
import { getFiles, insertFiles, deleteFiles } from "./db"
import { Sync } from "./store"

export async function upload(env: Env, ctx: ExecutionContext, req: Request) {
    const [newFile, existFiles] = await Promise.all([toMyFile(req), getFiles(env)])
    const files = existFiles.filter((f) => f.path !== newFile.path).concat(newFile)

    await Sync(env, files)
    ctx.waitUntil(insertFiles(env, newFile))

    if (files.length > existFiles.length) {
        return 201
    } else {
        return 204
    }
}

export async function remove(env: Env, ctx: ExecutionContext, path: string) {
    const existFiles = await getFiles(env)
    const removeFiles = existFiles.filter((f) => f.path === path)
    const otherFiles = existFiles.filter((f) => f.path !== path)

    if (removeFiles.length === 0) {
        return 404
    }

    await Sync(env, otherFiles)
    ctx.waitUntil(deleteFiles(env, ...removeFiles))
    return 204
}
