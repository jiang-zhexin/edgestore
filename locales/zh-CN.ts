import { wordList } from "./type"

export const zh_cn: wordList = {
    tableTitle: {
        name: "文件名",
        size: "大小",
        status: "状态",
        action: "操作",
    },
    tableFoot: {
        count: "总数",
        total: "总大小",
    },
    fileStatus: {
        tooBig: "文件过大",
        notUploaded: "未上传",
        uploading: "上传中",
        uploadFail: "上传失败",
        uploaded: "已上传",
        deleting: "删除中",
        deleteFail: "删除失败",
        deleted: "已删除",
    },
    action: {
        upload: "上传",
        delete: "删除",
    },
    inputLable: "选择文件 ...",
    token: {
        exist: "你的 token 已被保存",
        notExist: "输入你的 token",
        invalid: "你当前的 token 似乎无效",
    },
}
