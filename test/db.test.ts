import { env, } from 'cloudflare:test'
import { it, describe } from 'vitest'
import { insertFiles } from '../src/db'
import { toMyFile } from '../src/common'

describe('db', () => {
    it('insert', async () => {
        const path = '/test2.txt'
        const data = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33])
        const newFile = await toMyFile(path, data)

        const result = await insertFiles(env, newFile)
        console.log(result)
    })
})

