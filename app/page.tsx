"use client"

import { Locales, SetWordContext, WordContext } from "@/locales/locale"
import dynamic from "next/dynamic"
import { useState } from "react"
import FileInput from "./table"
import TopBar from "./topbar"

import { TokenContext } from "./token"

function Page() {
    const [language, setLanguage] = useState<string>(localStorage.getItem("language") ?? navigator.language)
    const word = Locales[language] ?? Locales["en-US"]

    return (
        <>
            <WordContext value={word}>
                <TokenContext
                    value={{
                        value: localStorage.getItem("token") ?? "",
                        effect: localStorage.getItem("tokenEffect") ? true : false,
                    }}
                >
                    <SetWordContext value={setLanguage}>
                        <TopBar />
                    </SetWordContext>
                </TokenContext>
                <FileInput />
            </WordContext>
        </>
    )
}

export default dynamic(() => Promise.resolve(Page), {
    ssr: false,
})
