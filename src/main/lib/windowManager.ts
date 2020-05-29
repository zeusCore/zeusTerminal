import { BrowserWindow, shell } from 'electron'
import qs from 'qs'
// 登录窗口最小化
const windowsConfig = require('../windows.config.json')

/**
 * 打开窗口，并且初始化
 */
export default new (class WindowManager {
    public windows: { [target: string]: BrowserWindow } = {}

    public focus(target) {
        if (!target) {
            throw new Error('lack of target param')
        }
        if (this.windows[target]) {
            if (!this.windows[target].isVisible()) {
                this.windows[target].show()
            }
            if (this.windows[target].isMinimized()) {
                this.windows[target].restore()
            }
            this.windows[target].focus()
        }
    }

    public ifOpen(target, options?: PlainObject | null) {
        if (!target) {
            throw new Error('lack of target param')
        }
        if (this.windows[target]) {
            this.focus(target)
        } else {
            this.open(target, options)
        }
    }

    public open(target, options?: PlainObject | null) {
        console.log(`open(${target})`)
        if (!target || !windowsConfig[target]) {
            throw new Error(`no such window: ${target}`)
        }
        const queryStr = options ? '?' + qs.stringify(options) : ''
        const winURL =
            process.env.NODE_ENV === 'development'
                ? `http://localhost:9080/${target}.html` + queryStr
                : `file://${__dirname}/${target}.html` + queryStr
        const win = (this.windows[target] = new BrowserWindow(
            windowsConfig[target]
        ))
        win.loadURL(winURL)
        this.initWindow(target, win)
    }

    public close(target) {
        console.log('close(target)', target)
        if (this.windows[target]) {
            if (target === 'index') {
                console.log('hide')
                this.windows[target].hide()
            } else {
                this.windows[target].close()
            }
        }
    }

    public closeAll(but?) {
        Object.keys(this.windows).forEach((item) => {
            try {
                if (but) {
                    if (this.windows[item] && item !== but) {
                        this.windows[item].close()
                    }
                } else {
                    this.windows[item].close()
                }
            } catch (e) {
                console.log(e.toString())
            }
        })
    }

    public minimize(target) {
        this.windows[target].minimize()
    }
    public maximize(target) {
        if (process.platform === 'darwin') {
            if (this.windows[target].isFullScreen()) {
                this.windows[target].setFullScreen(false)
            } else {
                this.windows[target].setFullScreen(true)
            }
        } else {
            if (this.windows[target].isMaximized()) {
                this.windows[target].unmaximize()
            } else {
                this.windows[target].maximize()
            }
        }
    }
    public initWindow(target, win) {
        win.on('closed', () => {
            delete this.windows[target]
        })
        win.on('close', (e) => {
            console.log('window.close', e)
        })
        win.on(
            'new-window',
            (event, url, fname, disposition, options) => {
                shell.openExternal(url)
                console.log(url)
                event.preventDefault()
            }
        )
    }
})()
