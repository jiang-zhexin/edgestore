"use client"

import { useContext } from "react"

import { SetWordContext } from "@/locales/locale"
import styles from "@/styles/language.module.css"

export default function Language({ language, show }: { language: string; show: string }) {
    const setLang = useContext(SetWordContext)
    return (
        <button
            className={styles.action}
            onClick={() => {
                setLang(language)
                localStorage.setItem("language", language)
            }}
        >
            {show}
        </button>
    )
}
