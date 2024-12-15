import { env } from "cloudflare:test"
import { it } from "vitest"
import { Sync } from "../src/store"
import { toMyFile } from "../src/common"

it("upload", async () => {
    const path = "/test.txt"
    const data = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100])
    const newFile = await toMyFile(path, data)

    await Sync(env, newFile)
})
