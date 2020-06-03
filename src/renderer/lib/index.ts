export const cleanCmds = (cmd: string) => {
    console.log(cmd.split(/[\n\r]/g))
    const cmds = cmd
        .split(/[\n\r]/g)
        .filter((cmd) => !!cmd.trim())
        .map((cmd) => {
            if (cmd.includes('#')) {
                return cmd.substr(0, cmd.indexOf('#')).trim()
            } else {
                return cmd.trim()
            }
        })
        .filter((cmd) => !!cmd)
        .join('\n\r')

    if (!/[a-z]/gi.test(cmds)) {
        return ''
    }
    return cmds
}
