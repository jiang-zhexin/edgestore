import React, { useContext } from "react"

import { TokenContext } from "./token"
import { WordContext } from "@/locales/locale"

import styles from "@/styles/tokeninput.module.css"

export default function TokenInput() {
    const word = useContext(WordContext)
    const token = useContext(TokenContext)
    return (
        <>
            <input
                className={styles.input}
                placeholder={token.current.value ? (token.current.effect ? word.token.exist : word.token.invalid) : word.token.notExist}
                type="password"
                onChange={(e) => {
                    localStorage.setItem("token", e.target.value)
                    localStorage.setItem("tokenEffect", "true")
                    token.current.value = e.target.value
                }}
            />
        </>
    )
}
