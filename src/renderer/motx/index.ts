import MotX from 'motx/dist/motx-vue'
import { ipcRenderer } from 'electron'

const _modules = require.context('./channels', true, /\.ts$/)

const terminals: ITerminal[] = JSON.parse(window.localStorage.terminals || '[]')
if (!terminals.length) {
    terminals.push({ id: Date.now(), title: '', cmds: '' })
}

const motx = new MotX({
    name: 'main',
    isolate: true,
    pipes: {
        main(message) {
            ipcRenderer.send('MotX', message)
        }
    },
    store: {
        terminals,
        columns: 3,
        focused: [1]
    },
    hooks: {
        didPublish(channel: string, args: any[]) {
            // console.log('[Motx] didPublish', args)
        },
        didSetState(fieldName: string, newState, isolate: boolean, store) {
            // console.log('[Motx] didSetState', fieldName, newState)
            switch (fieldName) {
                case 'terminals':
                    window.localStorage.terminals = JSON.stringify(newState)
                    break;
            }
        }
    }
})

ipcRenderer.on('MotX', (event, message) => {
    motx.onReceive(message)
})

_modules.keys().forEach((item: string) => {
    _modules(item).default(motx)
})


export default motx
