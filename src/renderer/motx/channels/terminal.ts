import MotxVue from 'motx/dist/motx-vue'
export default (motx: MotxVue) => {
    motx.subscribe('copy-terminal', (targetId: number) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        const term = terminals.find((item: ITerminal) => item.id === targetId)
        const newTerm = JSON.parse(JSON.stringify(term))
        newTerm.id = Date.now()
        const targetIndex = terminals.findIndex((item) => item.id === targetId)
        terminals.splice(targetIndex + 1, 0, newTerm)
        motx.setState('terminals', terminals)
        setTimeout(() => {
            motx.publish('terminal-fit')
        }, 100)
    })

    motx.subscribe('push-terminal', (details: ITerminal) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        terminals.push({
            id: Date.now(),
            title: '',
            cmds: [],
            ...details
        })
        motx.setState('terminals', terminals)
        setTimeout(() => {
            motx.publish('terminal-fit')
        }, 100)
    })

    motx.subscribe('add-terminal', (details: ITerminal) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        terminals.splice(details.index, 0, {
            id: Date.now(),
            title: '',
            cmds: [],
            ...details
        })
        motx.setState('terminals', terminals)
        setTimeout(() => {
            motx.publish('terminal-fit')
        }, 100)
    })

    motx.subscribe('add-terminal-cmd', (id: number) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        const term = terminals.find((item: ITerminal) => item.id === id)
        term.cmds.push({
            id: Date.now(),
            label: '',
            shell: ''
        })
        motx.setState('terminals', terminals)
    })

    motx.subscribe('save-terminal-cmd', (id: number, cmd: ICmd) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        const term = terminals.find((item: ITerminal) => item.id === id)
        const targetCmd = term.cmds.find((item) => item.id === cmd.id)
        Object.assign(targetCmd, cmd)
        motx.setState('terminals', terminals)
    })

    motx.subscribe('delete-terminal-cmd', (id: number, cmdId: number) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        const term = terminals.find((item: ITerminal) => item.id === id)
        const index = term.cmds.findIndex((item) => item.id === cmdId)
        term.cmds.splice(index, 1)
        motx.setState('terminals', terminals)
    })

    motx.subscribe('update-terminal', (details: ITerminal) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        const term = terminals.find((item: ITerminal) => item.id === details.id)
        Object.assign(term, details)
        motx.setState('terminals', terminals)
    })

    motx.subscribe('save-terminals', (terminals: ITerminal[]) => {
        motx.setState('terminals', terminals)
    })

    motx.subscribe('delete-terminal', (id: number) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        const index = terminals.findIndex((item) => item.id === id)
        terminals.splice(index, 1)
        motx.setState('terminals', terminals)
        setTimeout(() => {
            motx.publish('terminal-fit')
        }, 100)
    })
}
