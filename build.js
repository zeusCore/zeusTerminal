const builder = require('electron-builder')
const Platform = builder.Platform

const exec = require('child_process').exec

exec('rm -rf build', function(err, out) {
    console.log(out)
    err && console.log(err)
})

const base = {
    productName: 'zeus-terminal',
    artifactName: 'zeus-terminal-setup-${version}.${ext}',
    appId: 'com.passkee.zeus-terminal',
    copyright: 'Copyright © 2018 yun.to8to.com',
    directories: {
        output: 'build'
    },
    files: ['dist/electron/**/*']
}

const dmg = {
    contents: [
        {
            x: 410,
            y: 150,
            type: 'link',
            path: '/Applications'
        },
        {
            x: 130,
            y: 150,
            type: 'file'
        }
    ]
}

const nsis = {
    oneClick: false,
    perMachine: true,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'static/app-logo.ico',
    installerHeaderIcon: 'static/app-logo.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true
}
const mac = {
    icon: 'static/app-logo.icns'
}

const win32 = {
    icon: 'static/app-logo.ico',
    requestedExecutionLevel: 'requireAdministrator',
    target: [
        {
            target: 'nsis',
            arch: ['ia32']
        }
    ]
}
const win64 = {
    icon: 'static/app-logo.ico',
    requestedExecutionLevel: 'requireAdministrator',
    target: [
        {
            target: 'nsis',
            arch: ['x64']
        }
    ]
}

;(async () => {
    // const w32 = await builder.build({
    //     targets: Platform.WINDOWS.createTarget(),
    //     config: Object.assign(
    //         {},
    //         base,
    //         { win: win32, nsis },
    //         { artifactName: 'SuperBrain-Setup-ia32-${version}.${ext}' }
    //     )
    // })
    const m = await builder.build({
        targets: Platform.MAC.createTarget(),
        config: Object.assign({}, base, { mac, dmg })
    })
    const w64 = await builder.build({
        targets: Platform.WINDOWS.createTarget(),
        config: Object.assign({}, base, { win: win64, nsis })
    })
})()
