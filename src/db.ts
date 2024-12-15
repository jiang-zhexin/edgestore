import type { MyFile } from "./type"

export async function getFiles(env: Env): Promise<MyFile[]> {
    const files = await env.DB.prepare("SELECT * FROM files").run<MyFile>()
    return files.results
}

export function insertFiles(env: Env, ...files: MyFile[]): Promise<D1Result<never>[]> {
    return env.DB.batch<never>(
        files.map((file) =>
            env.DB.prepare("INSERT INTO files (path, hash, size) VALUES (?1, ?2, ?3)").bind(file.path, file.hash, file.size)
        )
    )
}

export function deleteFiles(env: Env, ...files: MyFile[]): Promise<D1Result<never>[]> {
    return env.DB.batch<never>(files.map((file) => env.DB.prepare("DELETE FROM files WHERE hash = ?1").bind(file.hash)))
}
