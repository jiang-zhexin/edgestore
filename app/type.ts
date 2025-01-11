import { statusMap } from "@/locales/type"

export type myFiles = {
    files: myFile[]
    count: number
    total: number
}

export type myFile = {
    file: File
    status: statusMap
}
