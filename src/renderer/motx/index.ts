import MotX from 'motx/dist/motx-vue'
import { ipcRenderer } from 'electron'

let terminalUid = 0
const motx = new MotX({
    name: 'main',
    isolate: false,
    pipes: {
        main(message) {
            ipcRenderer.send('MotX', message)
        }
    },
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

ipcRenderer.on('MotX', (event, message) => {
    motx.onReceive(message)
})

require('./select').default(motx)
require('./toast').default(motx)

export default motx
