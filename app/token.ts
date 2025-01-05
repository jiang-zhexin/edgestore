import { createContext, RefObject } from "react"

export const TokenContext = createContext<RefObject<string>>({} as RefObject<string>)
