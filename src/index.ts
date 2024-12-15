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
    return c.text("Internal Server Error")
})

app.get("*", async (c) => {
    return c.env.store.fetch(c.req.raw)
})

app.put(
    "*",
    bodyLimit({
        maxSize: 25 * 1024 * 1024,
        onError: (c) => {
            c.status(413)
            return c.text("Content Too Large")
        },
    }),
    async (c) => {
        const statusCode = await upload(c.env, c.executionCtx, c.req.raw)
        switch (statusCode) {
            case 201:
                c.header("Location", c.req.path)
                return c.status(201)
            case 204:
                return c.status(204)
        }
    }
)

app.delete("*", async (c) => {
    const statusCode = await remove(c.env, c.executionCtx, c.req.path)
    return c.status(statusCode)
})

export default app
