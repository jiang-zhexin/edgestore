"use client"

import { createContext, Dispatch, SetStateAction } from "react"

import type { wordList, locales } from "@/locales/type"
import { en_us } from "@/locales/en-US"
import { zh_cn } from "@/locales/zh-CN"

export const WordContext = createContext<wordList>({} as wordList)
export const SetWordContext = createContext<Dispatch<SetStateAction<string>>>({} as Dispatch<SetStateAction<string>>)

export const Locales: locales = {
    "zh-CN": zh_cn,
    "en-US": en_us,
}
