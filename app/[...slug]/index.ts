// import { Hono } from "hono"
// import { bearerAuth } from "hono/bearer-auth"
// import { bodyLimit } from "hono/body-limit"
// import { cors } from "hono/cors"
// import { createMiddleware } from "hono/factory"

// import { toMyFile } from "./common"
// import { deleteFiles, getFiles, insertFiles, updateFiles } from "./db"
// import { Sync } from "./store"

// const app = new Hono<{ Bindings: Env }>()

// app.onError((err, c) => {
//     console.error(err)
//     return c.text("500 Internal Server Error", 500)
// })

// app.get(
//     "*",
//     async (c, next) => {
//         await next()
//         c.header("cache-control", "public, max-age=86400, must-revalidate")
//     },
//     cors({
//         origin: "*",
//         allowMethods: ["GET"],
//         maxAge: 86400,
//     }),
//     async (c) => {
//         const response = await c.env.store.fetch(c.req.raw)
//         return new Response(response.body, response)
//     }
// )

// const BearerAuthMiddleware = createMiddleware(
//     bearerAuth({
//         realm: "Your Token",
//         verifyToken: (token, c) => token === c.env.token,
//         noAuthenticationHeaderMessage: (c) => c.text("Unauthorized", 401),
//         invalidAuthenticationHeaderMessage: (c) => c.text("Unauthorized", 401),
//         invalidTokenMessage: (c) => c.text("Forbidden", 403),
//     })
// )

// app.put(
//     "*",
//     BearerAuthMiddleware,
//     bodyLimit({
//         maxSize: 25 * 1024 * 1024,
//         onError: (c) => {
//             return c.text("413 Content Too Large", 413)
//         },
//     }),
//     async (c) => {
//         const [newFile, existFiles] = await Promise.all([toMyFile(c.req.raw), getFiles(c.env)])
//         const syncFiles = existFiles.filter((f) => f.path !== newFile.path).concat(newFile)

//         await Sync(c.env, syncFiles)

//         c.header("Content-Location", c.req.url)
//         if (syncFiles.length > existFiles.length) {
//             c.executionCtx.waitUntil(insertFiles(c.env, newFile))
//             c.header("Location", c.req.url)
//             return c.text("201 Created", 201)
//         }
//         c.executionCtx.waitUntil(updateFiles(c.env, newFile))
//         return c.newResponse(null, 204)
//     }
// )

// app.delete("*", BearerAuthMiddleware, async (c) => {
//     const existFiles = await getFiles(c.env)
//     const removeFiles = existFiles.filter((f) => f.path === c.req.path)

//     if (removeFiles.length === 0) {
//         return c.text("404 Not Found", 404)
//     }

//     if (c.req.query("lazy") === "false") {
//         const syncFiles = existFiles.filter((f) => f.path !== c.req.path)
//         await Sync(c.env, syncFiles)
//     }
//     c.executionCtx.waitUntil(deleteFiles(c.env, ...removeFiles))
//     return c.newResponse(null, 204)
// })

// export default app
