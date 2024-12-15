export interface MyFile extends FileMetadata {
    path: string
    type: string
    data?: Uint8Array
}

export interface FileMetadata {
    size: number
    hash: string
}
