import { app, Tray, Menu } from 'electron'
// import AutoUpdate from './lib/AutoUpdate'
// import AutoUpdate from './lib/AutoUpdate2'
import updateTips from './lib//updateTips'
import path from 'path'
import winManager from './lib/windowManager'
import motx from './motx'
import log from 'electron-log'
import ses from '#/lib/session'

declare const global: any

log.info('runtime in')

// import debug from 'electron-debug'
log.catchErrors({ showDialog: false })
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    ; (global as any).__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\')
}

app.commandLine.appendSwitch('ignore-gpu-blacklist')
app.commandLine.appendSwitch('no-sandbox')
app.disableDomainBlockingFor3DAPIs()
app.commandLine.appendSwitch('enable-webgl')
app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers')
app.commandLine.appendSwitch('enable-accelerated-2d-canvas')
app.commandLine.appendSwitch('enable-accelerated-3d-canvas')

log.info('app.commandLine.appendSwitch')

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    log.info('gotTheLock')
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        log.info('second-instance')
        // Someone tried to run a second instance, we should focus our window.
        motx.publish('window-open', { target: 'index' })
    })
    app.on('ready', async () => {

        await ses.initSession()

        openHome()

        motx.publish('set-auto-launch', true)

        motx.subscribe(
            'latest-version-downloaded',
            ({ version, downloadInBrowser }: any) => {
                if (winManager.windows.index) {
                    motx.pipe('index').publish('has-new-version', {
                        version,
                        downloadInBrowser
                    })
                }
                if (winManager.windows.login) {
                    motx.pipe('login').publish('has-new-version', {
                        version,
                        downloadInBrowser
                    })
                }
            }
        )
        motx.subscribe('page-mounted', ({ target }: any) => {
            if (target === 'index' || target === 'login') {
                updateTips.check()
            }
        })

        const tray: Tray = new Tray(path.join(__static, 'app-logo.ico'))
        const menu = Menu.buildFromTemplate([
            {
                label: '设置',
                click: async () => {
                    motx.publish('window-open', { target: 'setting' })
                }
            },
            {
                label: '打开',
                click: async () => {
                    openHome()
                }
            },
            { type: 'separator' },
            {
                label: '退出',
                click: async () => {
                    motx.publish('app-quit', {})
                }
            }
        ])
        tray.setContextMenu(menu)
        tray.setToolTip('图满意 - 感知云设计，体验未来家')
        tray.on('double-click', () => {
            openHome()
        })

        tray.on('click', () => {
            openHome()
        })

        global.tray = tray
    })

    app.on('window-all-closed', () => {
        console.log('all closed')
    })

    app.on('activate', openHome)
}

async function openHome() {
    log.info('openHome')
    if (!winManager.windows.index) {
        winManager.open('index')
        return
    } else {
        winManager.focus('index')
    }

}
