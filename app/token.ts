import { createContext, RefObject } from "react"

export const TokenContext = createContext<
    RefObject<{
        value: string
        effect: boolean
    }>
>({
    current: {
        value: "",
        effect: false,
    },
})
