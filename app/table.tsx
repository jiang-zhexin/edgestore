"use client"

import { filesize } from "filesize"

import { useContext, useEffect, useState } from "react"

import { WordContext } from "@/locales/locale"
import { FileList } from "./filelist"
import { statusMap, type myFiles } from "./type"

import styles from "@/styles/table.module.css"
import { TokenContext } from "./token"

export default function FileInput() {
    const word = useContext(WordContext)
    const token = useContext(TokenContext)

    const [myFiles, setMyFiles] = useState<myFiles>({
        files: [],
        count: 0,
        total: 0,
    })

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetch("/list", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token.current.value}`,
                },
            })
            if (resp.status === 200) {
                const result = await resp.json<File[]>()
                let total = 0
                const files = result.map((f) => {
                    total += f.size
                    return {
                        file: f,
                        status: statusMap.uploaded,
                    }
                })
                setMyFiles({
                    files,
                    count: files.length,
                    total,
                })
            }
        }
        fetchData()
    }, [])

    const Table = () => {
        const { files, count, total } = myFiles
        if (count > 0)
            return (
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tr}>
                            <th scope="col" className={styles.th} style={{ borderTopLeftRadius: "8px" }}>
                                {word.tableTitle.name}
                            </th>
                            <th scope="col" className={styles.th}>
                                {word.tableTitle.size}
                            </th>
                            <th scope="col" className={styles.th}>
                                {word.tableTitle.status}
                            </th>
                            <th scope="col" className={styles.th} style={{ borderTopRightRadius: "8px" }}>
                                {word.tableTitle.action}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((myFile, index) => (
                            <FileList key={index} file={myFile} />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className={styles.tr}>
                            <th scope="row" colSpan={2} className={styles.th} style={{ borderBottomLeftRadius: "8px" }}>
                                {word.tableFoot.count}: {count}
                            </th>
                            <th scope="row" colSpan={2} className={styles.th} style={{ borderBottomRightRadius: "8px" }}>
                                {word.tableFoot.total}: {filesize(total)}
                            </th>
                        </tr>
                    </tfoot>
                </table>
            )
    }

    const inputId = "inputId"
    return (
        <>
            <input
                type="file"
                multiple
                className={styles.input}
                id={inputId}
                onChange={(e) => {
                    let total = 0
                    const files = Array.from(e.target.files ?? []).map((file) => {
                        total += file.size
                        return { file: file, status: file.size < 25 * 1024 * 1024 ? statusMap.notUploaded : statusMap.tooBig }
                    })
                    setMyFiles({
                        files,
                        count: files.length,
                        total: total,
                    })
                }}
            />
            <label htmlFor={inputId} className={styles.label}>
                {word.inputLable}
            </label>
            <Table />
        </>
    )
}
