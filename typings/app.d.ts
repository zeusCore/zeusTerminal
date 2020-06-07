interface ITerminal {
    id: number
    title: string
    cmds: ICmd[]
    index?: number
    cnnid?: string
    status?: number
    type?: number
}
interface ICmd {
    id: number
    label: string
    shell: string
}

interface Func {
    (...args): any
}
