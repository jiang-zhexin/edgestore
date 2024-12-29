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
    }
}

export type fileStatus = {
    tooBig: string
    notUploaded: string
    uploading: string
    uploadFail: string
    uploaded: string
    deleting: string
    deleteFail: string
    deleted: string
}

export type action = {
    upload: string
    delete: string
}

export type locales = { [language: string]: wordList }
