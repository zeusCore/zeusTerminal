import MotxVue from 'motx/dist/motx-vue'
export default (motx: MotxVue) => {
    motx.subscribe('add-terminal', (details: ITerminal) => {
        const terminals: ITerminal[] = motx.getState('terminals')
        terminals.splice(details.index, 0, {
            id: Date.now(),
            title: '',
            cmds: '',
            ...details
        })
        motx.setState('terminals', terminals)
        setTimeout(() => {
            motx.publish('terminal-fit')
        }, 100)
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

}
