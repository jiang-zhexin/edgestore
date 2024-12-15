import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"

import { remove, upload } from "./method"

const app = new Hono<{ Bindings: Env }>()

app.onError((err, c) => {
    console.error({
        event: "error",
        result: err,
    })
    c.status(500)
    return c.text("Seem appear some errors")
})

app.get("*", async (c) => {
    return c.env.store.fetch(c.req.raw)
})

app.put(
    "*",
    bodyLimit({
        maxSize: 25 * 1024 * 1024,
        onError: (c) => {
            return c.text("Too big file", 413)
        },
    }),
    async (c) => {
        await upload(c.env, c.executionCtx, c.req.raw)

        return c.json({
            url: `https://${c.env.host}${c.req.path}`,
            message: "put the file success",
        })
    }
)

app.delete("*", async (c) => {
    await remove(c.env, c.executionCtx, c.req.path)

    return c.json({
        url: `https://${c.env.host}${c.req.path}`,
        message: "delete the file success",
    })
})

export default app
