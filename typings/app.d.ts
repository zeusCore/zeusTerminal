interface ITerminal {
    id: number
    title: string
    cmds: ICmd[]
    index?: number
}
interface ICmd {
    id: number
    label: string
    shell: string
}
