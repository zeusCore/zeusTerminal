import { app, shell } from 'electron'
import semver from 'semver'
import fs from 'fs-extra'
import path from 'path'
import motx from '#/motx'
import request from './request'
import log from 'electron-log'

export default new (class AppUpdater {
    public info: PlainObject = {}
    public localPath: string = ''
    public downloadUrl: string = ''
    public latestVersion: string = ''
    private api: string = `https://zeusflashapi.to8to.com/api/widgets?scope=${encodeURI(
        '桌面端-版本自动更新'
    )}`

    public async check() {
        const { code, data, error } = await request.get(this.api, 'json')
        // console.log(data[0])
        if (!code && !error) {
            if (data && data[0] && data[0].config) {
                let target = 'win32'
                if (process.platform === 'darwin') {
                    target = 'mac'
                } else if (process.platform === 'win32') {
                    if (process.arch === 'x64') {
                        target = 'win64'
                    }
                }
                const version = (this.latestVersion = (
                    data[0].config || ''
                ).trim())

                this.downloadUrl = data[0].details.find(
                    (item) => item.title === target
                ).link
                const ext = { win32: 'exe', win64: 'exe', mac: 'dmg' }[target]
                this.localPath = path.join(
                    app.getPath('temp'),
                    `tumanyi.setup.${version}.${ext}`
                )

                const currentVersion = app.getVersion()
                // process.env.NODE_ENV === 'development'
                //     ? '1.0.1'
                //    : app.getVersion()

                console.log(version, currentVersion)
                console.log(this.downloadUrl)
                console.log(this.localPath)

                if (semver.gt(version, currentVersion)) {
                    if (fs.existsSync(this.localPath)) {
                        motx.publish('latest-version-downloaded', {
                            version
                        })
                    } else {
                        if (this.downloadUrl) {
                            this.download()
                        } else {
                            motx.publish('latest-version-downloaded', {
                                version,
                                downloadInBrowser: true
                            })
                        }
                    }
                } else if (semver.eq(version, currentVersion)) {
                    if (fs.existsSync(this.localPath)) {
                        fs.removeSync(this.localPath)
                    }
                }
            }
        }
    }
    public gotoDownload() {
        shell.openExternal(
            'https://3dstatic.t8tcdn.com/zeus-web/downloadPage.html?t=' +
            Date.now()
        )
    }
    public install() {
        app.quit()
        shell.openItem(this.localPath)
    }

    public async download() {
        log.info('to download', this.downloadUrl)
        try {
            await request.download(this.downloadUrl, this.localPath)
            motx.publish('latest-version-downloaded', {
                version: this.latestVersion
            })
            log.info('downloaded', this.localPath)
        } catch (e) {
            log.error(e)
        }
    }
})()
