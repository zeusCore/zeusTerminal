import windowManager from '#/lib/windowManager'
import { app } from 'electron'
export default (motx) => {
    motx.subscribe('window-open', ({ target, params }: any) => {
        if (!target) {
            throw new Error(`lack of target`)
        }
        windowManager.ifOpen(target, params)
    })

    motx.subscribe('window-focus', ({ target }: any) => {
        windowManager.focus(target)
    })

    // close 会触发针对特定窗口的关联性控制
    motx.subscribe('window-close', ({ target }: any) => {
        if (target) {
            windowManager.close(target)
            closeHandler('close', target)
        } else {
            throw new Error(`sub window-close, lack of target`)
        }
    })

    motx.subscribe('window-close-all', ({ except }: any) => {
        windowManager.closeAll(except)
        closeHandler('close-all', '', except)
    })

    motx.subscribe('window-close-all-and-open', ({ target, params }: any) => {
        windowManager.closeAll()
        windowManager.open(target, params)
        closeHandler('close-all-and-open', target)
    })

    motx.subscribe('window-min', ({ target }: any) => {
        windowManager.minimize(target)
    })

    motx.subscribe('window-max', ({ target }: any) => {
        windowManager.maximize(target)
    })

    motx.subscribe('app-quit', () => {
        windowManager.closeAll()
        app.quit()
    })
}

function closeHandler(action, target, opt?: any) {
    switch (action) {
        case 'close':

            if (windowManager.windows.index) {
                windowManager.windows.index.focus()
            } else if (windowManager.windows.login) {
                windowManager.windows.login.focus()
            }
            break

    }
}
