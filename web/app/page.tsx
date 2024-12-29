"use client"

import { Locales, SetWordContext, WordContext } from "@/locales/locale"
import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import FileInput from "./table"
import TopBar from "./topbar"

import { TokenContext } from "./token"

function Page() {
    const [language, setLanguage] = useState<string>(localStorage.getItem("language") ?? navigator.language)
    const word = Locales[language] ?? Locales["en-US"]
    const token = useRef(localStorage.getItem("token") ?? "")
    return (
        <>
            <WordContext value={word}>
                <TokenContext value={token}>
                    <SetWordContext value={setLanguage}>
                        <TopBar />
                    </SetWordContext>
                    <FileInput />
                </TokenContext>
            </WordContext>
        </>
    )
}

export default dynamic(() => Promise.resolve(Page), {
    ssr: false,
})
