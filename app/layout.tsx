"use client"

import "./globals.css"
import styles from "@/styles/layout.module.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <title>Edge Store</title>
                <link rel="icon" href="/icon.svg" />
                <link rel="apple-touch-icon" href="/icon.svg" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className={styles.body}>{children}</body>
        </html>
    )
}
