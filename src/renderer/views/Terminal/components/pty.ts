import os from 'os'
import { remote } from 'electron'
import fs from 'fs-extra'
import { spawn, IPty } from 'node-pty'

export default (): IPty => {
    const isWin32 = os.platform() === 'win32'

    let shell = isWin32 ? 'powershell.exe' : 'bash'
    if (fs.existsSync('/bin/zsh')) {
        shell = 'zsh'
    }

    const env = process.env
    env['LC_ALL'] = 'zh_CN.UTF-8'
    env['LANG'] = 'zh_CN.UTF-8'
    env['LC_CTYPE'] = 'zh_CN.UTF-8'

    const ptyProcess = spawn(shell, !isWin32 ? ['--login'] : [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: remote.app.getPath('home'),
        env,
        encoding: null
    })
    return ptyProcess
}
