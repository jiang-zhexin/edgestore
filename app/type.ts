import { fileStatus } from "@/locales/type"

export type myFiles = {
    files: myFile[]
    count: number
    total: number
}

export type myFile = {
    file: File
    status: keyof fileStatus
}

export const statusMap: {
    [K in keyof fileStatus]: K
} = {
    tooBig: "tooBig",
    notUploaded: "notUploaded",
    uploading: "uploading",
    uploadFail: "uploadFail",
    uploaded: "uploaded",
    deleting: "deleting",
    deleteFail: "deleteFail",
    deleted: "deleted",
}
