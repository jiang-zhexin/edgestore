import { encodeHex } from "@std/encoding"

import type { MyFile } from "./type"

export async function toMyFile(path: string, data: Uint8Array): Promise<MyFile> {
    return {
        path: path,
        data: data,
        size: data.length,
        hash: await Sha256(data),
    }
}

/*
 * Function to calculate the SHA-256 hash of a file and truncate to 32 characters
 */
async function Sha256(uint8Array: Uint8Array) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", uint8Array)
    return encodeHex(hashBuffer).slice(0, 32)
}
