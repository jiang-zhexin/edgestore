import { getRequestContext } from "@cloudflare/next-on-pages"

import type { MyFile } from "./type"

export async function getFiles(): Promise<MyFile[]> {
    const { env } = getRequestContext()

    const files = await env.DB.prepare("SELECT * FROM files").run<MyFile>()
    return files.results
}

export function insertFiles(...files: MyFile[]): Promise<D1Result<never>[]> {
    const { env } = getRequestContext()

    return env.DB.batch<never>(
        files.map((file) =>
            env.DB.prepare("INSERT INTO files (path, hash, size, type) VALUES (?1, ?2, ?3, ?4)").bind(
                file.path,
                file.hash,
                file.size,
                file.type
            )
        )
    )
}

export function deleteFiles(...files: MyFile[]): Promise<D1Result<never>[]> {
    const { env } = getRequestContext()

    return env.DB.batch<never>(files.map((file) => env.DB.prepare("DELETE FROM files WHERE path = ?1").bind(file.path)))
}

export function updateFiles(...files: MyFile[]): Promise<D1Result<never>[]> {
    const { env } = getRequestContext()

    return env.DB.batch<never>(
        files.map((file) =>
            env.DB.prepare("UPDATE files SET hash = ?1, size = ?2, type = ?3 WHERE path = ?4").bind(
                file.hash,
                file.size,
                file.type,
                file.path
            )
        )
    )
}
