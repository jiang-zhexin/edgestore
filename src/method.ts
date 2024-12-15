import { toMyFile } from "./common"
import { getFiles, insertFiles, deleteFiles } from "./db"
import { Sync } from "./store"

export async function upload(env: Env, ctx: ExecutionContext, path: string, data: Uint8Array) {
    const [newFile, existFiles] = await Promise.all([toMyFile(path, data), getFiles(env)])

    await Sync(env, newFile, ...existFiles)
    ctx.waitUntil(insertFiles(env, newFile))
}

export async function remove(env: Env, ctx: ExecutionContext, path: string) {
    const existFiles = await getFiles(env)
    const removeFiles = existFiles.filter((f) => f.path === path)
    const otherFiles = existFiles.filter((f) => f.path !== path)

    if (removeFiles.length === 0) {
        return
    }
    await Sync(env, ...otherFiles)
    ctx.waitUntil(deleteFiles(env, ...removeFiles))
}
