import MotX from 'motx'
import windowManager from '#/lib/windowManager'
import { ipcMain } from 'electron'

const _modules = require.context('./channels', true, /\.ts$/)

const motx = new MotX({
    name: 'main',
    pipes: (() => {
        const pipes = {}
            ;['setting', 'index', 'login'].forEach(
                (item) => {
                    pipes[item] = (message) => {
                        if (windowManager.windows[item]) {
                            ; (windowManager.windows[item] as any).send(
                                'MotX',
                                message
                            )
                        }
                    }
                }
            )
        return pipes
    })()
})
_modules.keys().forEach((item: string) => {
    _modules(item).default(motx)
})

motx.subscribe('log', (body) => {
    console.log(`[LOG]`, body)
})


ipcMain.on('MotX', (win, message) => {
    console.log('main.on MotX', message)
    motx.onReceive(message)
})

export default motx
