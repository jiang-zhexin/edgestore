import { toMyFile } from "./common"
import { getFiles, insertFiles, deleteFiles } from "./db"
import { Sync } from "./store"

export async function upload(env: Env, path: string, data: Uint8Array) {
    const newFile = await toMyFile(path, data)
    const existFiles = await getFiles(env)

    await Sync(env, newFile, ...existFiles)
    await insertFiles(env, newFile)
}

export async function remove(env: Env, path: string) {
    const existFiles = await getFiles(env)
    const removeFile = existFiles.filter(f => f.path === path)
    const otherFiles = existFiles.filter(f => f.path !== path)

    if (removeFile.length < 1) {
        return
    }
    await Sync(env, ...otherFiles)
    await deleteFiles(env, ...removeFile)
}