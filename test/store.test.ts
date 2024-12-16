import { env } from "cloudflare:test"
import { it } from "vitest"
import { Sync } from "../src/store"
import { toMyFile } from "../src/common"

it("upload", async () => {
    const req = new Request("http://localhost/测试.txt", {
        method: "PUT",
        body: new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33]),
    })
    const newFile = await toMyFile(req)

    await Sync(env, [newFile])
})
