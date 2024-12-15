import { env } from "cloudflare:test"
import { it, describe } from "vitest"
import { insertFiles, getFiles } from "../src/db"
import { toMyFile } from "../src/common"

describe("db", () => {
    it("insert", async () => {
        const req = new Request("http://localhoost/test2.txt", {
            method: "PUT",
            body: new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33]),
        })
        const newFile = await toMyFile(req)

        await insertFiles(env, newFile)
        const result = await getFiles(env)
        console.log(result)
    })
})
