<template>
  <section class="fuck-xterm-wrapper">
    <CTips />
    <section class="fuck-xterm-area"
             ref="xterm"></section>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Terminal } from 'xterm'
import os from 'os'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
import motx from '@/motx'
import CTips from './Tips.vue'

const fitAddon = new FitAddon()

const pty = require('node-pty')

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
const env = process.env
env['LC_ALL'] = 'zh_CN.UTF-8'
env['LANG'] = 'zh_CN.UTF-8'
env['LC_CTYPE'] = 'zh_CN.UTF-8'

const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: env,
    encoding: null
})

@Component({ components: { CTips } })
export default class XTerm extends Vue {
    mounted() {
        this.init()
    }
    init() {
        const xterm = new Terminal({
            cols: 80,
            rows: 30,
            fontSize: 12,
            lineHeight: 1.2,
            fontFamily: `Menlo, Monaco, 'Courier New', monospace`,
            rendererType: 'dom',
            theme: {
                foreground: '#ccc',
                background: '#222',
                cursor: 'rgb(254,239,143)'
            }
        })

        xterm.loadAddon(fitAddon)

        xterm.open(this.$refs.xterm as HTMLElement)

        fitAddon.fit()

        motx.subscribe('run', (val) => {
            if (val[val.length - 1] !== '\n') {
                ptyProcess.write(val + '\n')
            } else {
                ptyProcess.write(val)
            }
            xterm.focus()
        })

        xterm.onData((data, arg2) => {
            console.log(data)
            ptyProcess.write(data)
        })

        ptyProcess.on('data', function(data) {
            console.log('ptyProcess data', data.toString())
            xterm.write(data.toString())
        })
    }
}
</script>

<style lang="stylus">
.fuck-xterm-wrapper
  width 60%
  position fixed
  left 0
  top 0
  bottom 0
  .fuck-xterm-area
    padding 10px
</style>
