import { Hono } from 'hono'

import { remove, upload } from './method'

const app = new Hono<{ Bindings: Env }>()

app.onError((err, c) => {
	console.error({
		event: 'error',
		result: err,
	})
	return c.text('seem appear some errors')
})

app.get('*', async (c) => {
	return c.env.store.fetch(c.req.raw)
})

app.put('*', async (c) => {
	const body = await c.req.raw.bytes()
	await upload(c.env, c.req.path, body)

	return c.json({
		url: `https://${c.env.host}${c.req.path}`
	})
})

app.delete('*', async (c) => {
	await remove(c.env, c.req.path)

	return c.json({
		message: `delete ${c.req.path} success`
	})
})

export default app
