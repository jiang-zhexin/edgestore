"use client"

import Language from "./language"

import styles from "@/styles/topbar.module.css"
import TokenInput from "./tokeninput"

export default function TopBar() {
    return (
        <header className={styles.container}>
            <div className={styles.logo}>Edge Store</div>
            <TokenInput />
            <div>
                <Language language="en-US" show="English" />
                <Language language="zh-CN" show="简体中文" />
            </div>
        </header>
    )
}
