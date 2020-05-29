import { Registry } from 'rage-edit'
import { app } from 'electron'
import log from 'electron-log'
export default new (class {
    // private RUN: string = "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
    // private RUN: string = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
    private RUN: string =
        'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Run'
    // private RUN:string ="HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"

    private get isWin32() {
        return process.platform === 'win32'
    }

    public async getAutoLaunchStatus() {
        if (this.isWin32) {
            return await Registry.has(this.RUN, 'tumanyi')
        }

        return app.getLoginItemSettings().openAtLogin
    }
    // 设置启动
    public async setAutoLaunch(yes) {
        // this.checkEnv()
        console.log(yes, app.getLoginItemSettings().openAtLogin)

        if (yes) {
            if (this.isWin32) {
                console.log(this.RUN)
                try {
                    await Registry.set(
                        this.RUN,
                        'tumanyi',
                        app.getPath('exe'),
                        'REG_SZ'
                    )
                } catch (e) {
                    log.error(e)
                }
            }
            app.setLoginItemSettings({
                openAtLogin: true
            })
        } else {
            if (this.isWin32 && (await Registry.has(this.RUN, 'tumanyi'))) {
                try {
                    await Registry.delete(this.RUN, 'tumanyi')
                } catch (e) {
                    log.error(e)
                }
            }
            if (app.getLoginItemSettings().openAtLogin) {
                app.setLoginItemSettings({
                    openAtLogin: false
                })
            }
        }
    }
})()
