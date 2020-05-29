import MotX from 'motx/dist/motx-vue'

let terminalUid = 0
const motx = new MotX({
    name: 'main',
    isolate: false,
    store: {
        terminals: [
            { id: terminalUid++, title: 'HomeApp', cmds: '' },
            { id: terminalUid++, title: 'Terminal', cmds: '' }
        ],
        focused: [1]
    },
    hooks: {
        didPublish(channel: string, args: any[]) {
            // console.log('[Motx] didPublish', args)
        },
        didSetState(fieldName: string, newState, isolate: boolean, store) {
            // console.log('[Motx] didSetState', fieldName, newState)
        }
    }
})

require('./select').default(motx)

export default motx
