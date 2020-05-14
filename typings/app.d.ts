declare interface IBookCase {
    id: number
    nodeType: NodeType
    label: string
    isLeaf: boolean
    isEdit?: boolean
    children: IBookCase[]
}

declare interface ICatagory {
    id: number
    label: string
    children: ICatagory[]
}

declare enum NodeType {
    bookcase,
    book,
    article
}

declare interface Func {
    (...args: any): any
}

declare interface IArticle {
    id: number
    article: string
    hash: string
    update: number
    create: number
}
declare interface ITodo {
    id: number
    label: string
    done: boolean
    tag: string
    color: string
    cost: number
    children: ITodo[]
}
