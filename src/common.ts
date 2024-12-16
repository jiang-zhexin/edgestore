import { contentType } from "@std/media-types"
import { Buffer } from "node:buffer"

import type { MyFile } from "./type"

export async function toMyFile(req: Request): Promise<MyFile> {
    const { pathname } = new URL(req.url)
    const data = await req.bytes()
    const [_, extname] = pathname.split(".", 2)

    return {
        path: decodeURIComponent(pathname),
        data: data,
        size: data.length,
        hash: await Sha256(data),
        type: req.headers.get("Content-Type") ?? contentType(extname) ?? "application/octet-stream",
    }
}

/*
 * Function to calculate the SHA-256 hash of a file and truncate to 32 characters
 */
async function Sha256(uint8Array: Uint8Array) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", uint8Array)
    return Buffer.from(hashBuffer).toString("hex").slice(0, 32)
}
