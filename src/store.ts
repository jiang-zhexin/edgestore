import { encodeBase64 } from "@std/encoding"

import type { MyFile, FileMetadata } from "./type"

export async function Sync(env: Env, ...files: MyFile[]) {
    const { jwt, buckets } = await startUploadSession(env, files)
    const token = buckets.length > 0 ? await uploadFile(env, jwt, buckets, files) : jwt
    await uploadScript(env, token)
}

async function startUploadSession(env: Env, files: MyFile[]) {
    const fileMetadata: Record<string, FileMetadata> = {}
    files.map(f => {
        fileMetadata[f.path] = {
            hash: f.hash,
            size: f.size,
        }
    })

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.account_id}/workers/scripts/${env.script_name}/assets-upload-session`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Key": env.API_TOKEN,
                "X-Auth-Email": env.email,
            },
            body: JSON.stringify({ manifest: fileMetadata }),
        },
    )
    const result = await response.json<UploadResponse>()
    console.log({
        event: 'assets upload session',
        result: result,
    })
    if (result.success === false) {
        throw new Error(result.errors[0].message)
    }
    const jwt = result.result.jwt
    const buckets = result.result.buckets.flat()
    return { jwt, buckets }
}

async function uploadFile(env: Env, jwt: string, fileHashes: string[], files: MyFile[]) {
    const fileMap: Record<string, MyFile> = {}
    files.map(f => {
        fileMap[f.hash] = f
    })
    const form = new FormData()
    fileHashes.map(async (fileHash) => {
        const theFile = fileMap[fileHash]
        if (theFile.data === undefined) {
            throw new Error('Unexist file')
        }
        form.append(
            fileHash,
            new File([encodeBase64(theFile.data)], fileHash, {
                type: 'application/octet-stream',
            }),
            fileHash,
        )
    })

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.account_id}/workers/assets/upload?base64=true`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            body: form,
        },
    )
    const result = await response.json<UploadResponse>()
    console.log({
        event: 'assets upload',
        result: result
    })
    if (result.success === false) {
        throw new Error(result.errors[0].message)
    }
    return result.result.jwt
}

async function uploadScript(env: Env, jwt: string) {
    const form = new FormData()
    form.append(
        "metadata",
        JSON.stringify({ assets: { jwt } }),
    )

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.account_id}/workers/scripts/${env.script_name}`,
        {
            method: "PUT",
            headers: {
                "X-Auth-Key": env.API_TOKEN,
                "X-Auth-Email": env.email,
            },
            body: form,
        },
    )
    console.log({
        event: 'scripts upload',
        result: await response.json()
    })
    if (response.status != 200) {
        throw new Error("unexpected status code")
    }
}

interface UploadResponse {
    result: {
        jwt: string
        buckets: string[][]
    }
    success: boolean
    errors: any
    messages: any
}