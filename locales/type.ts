export type wordList = {
    tableTitle: {
        name: string
        size: string
        status: string
        action: string
    }
    tableFoot: {
        count: string
        total: string
    }
    fileStatus: fileStatus
    action: action
    inputLable: string
    token: {
        exist: string
        notExist: string
        invalid: string
    }
}

export type fileStatus = {
    [K in keyof typeof statusMap]: string
}

export type action = {
    upload: string
    delete: string
}

export type locales = { [language: string]: wordList }

export enum statusMap {
    tooBig,
    notUploaded,
    uploading,
    uploadFail,
    uploaded,
    deleting,
    deleteFail,
    deleted,
}
