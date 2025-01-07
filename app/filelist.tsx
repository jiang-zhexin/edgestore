"use client"

import { filesize } from "filesize"
import { useContext, useState } from "react"

import { WordContext } from "@/locales/locale"
import { fileStatus } from "@/locales/type"

import styles from "@/styles/filelist.module.css"
import { TokenContext } from "./token"
import { myFile, statusMap } from "./type"

export const FileList = ({ mf }: { mf: myFile }) => {
    const token = useContext(TokenContext)
    const word = useContext(WordContext)
    const [status, setStatus] = useState<keyof fileStatus>(mf.status)

    let link: string | null = mf.status === statusMap.uploaded ? `${location.protocol}//${location.host}/${mf.file.name}` : null

    const Action = () => {
        switch (status) {
            case statusMap.notUploaded:
            case statusMap.uploading:
            case statusMap.uploadFail:
                return (
                    <button
                        className={styles.action}
                        onClick={async () => {
                            setStatus(statusMap.uploading)
                            const resp = await fetch(`/${mf.file.name}`, {
                                method: "PUT",
                                body: mf.file,
                                headers: {
                                    Authorization: `Bearer ${token.current.value}`,
                                },
                            })
                            if (resp.status !== 201 && resp.status !== 204) {
                                setStatus(statusMap.uploadFail)
                                token.current.effect = false
                                localStorage.setItem("tokenEffect", "false")
                                console.log(resp.status)
                                return
                            }
                            link = resp.headers.get("Content-Location")
                            setStatus(statusMap.uploaded)
                        }}
                        disabled={status === statusMap.uploading}
                    >
                        {word.action.upload}
                    </button>
                )
            case statusMap.uploaded:
            case statusMap.deleting:
            case statusMap.deleteFail:
                return (
                    <button
                        className={styles.action}
                        onClick={async () => {
                            setStatus(statusMap.deleting)
                            const resp = await fetch(`/${mf.file.name}`, {
                                method: "DELETE",
                                headers: {
                                    Authorization: `Bearer ${token.current.value}`,
                                },
                            })
                            if (resp.status !== 404 && resp.status !== 204) {
                                setStatus(statusMap.deleteFail)
                                token.current.effect = false
                                localStorage.setItem("tokenEffect", "false")
                                console.log(resp.status)
                                return
                            }
                            setStatus(statusMap.deleted)
                        }}
                        disabled={status === statusMap.deleting}
                    >
                        {word.action.delete}
                    </button>
                )
        }
    }

    const Url = () => {
        switch (status) {
            case statusMap.uploaded:
            case statusMap.deleteFail:
                return (
                    <u
                        className={styles.u}
                        onClick={() => {
                            link ? navigator.clipboard.writeText(link) : alert("Server return a bad response")
                        }}
                    >
                        {mf.file.name}
                    </u>
                )
        }
        return <>{mf.file.name}</>
    }

    return (
        <tr className={styles.tr}>
            <th className={styles.th}>
                <Url />
            </th>
            <th className={styles.th}>{filesize(mf.file.size)}</th>
            <th className={styles.th}>{word.fileStatus[status]}</th>
            <th className={styles.th}>
                <Action />
            </th>
        </tr>
    )
}
