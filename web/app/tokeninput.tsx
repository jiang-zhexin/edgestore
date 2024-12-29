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
                placeholder={token.current ? word.token.exist : word.token.notExist}
                type="password"
                onChange={(e) => {
                    localStorage.setItem("token", e.target.value)
                    token.current = e.target.value
                }}
            />
        </>
    )
}
