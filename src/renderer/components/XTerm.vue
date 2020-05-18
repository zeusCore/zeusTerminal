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
import { SearchAddon } from 'xterm-addon-search'
import { WebLinksAddon } from 'xterm-addon-web-links'
import motx from '@/motx'
import CTips from './Tips.vue'

const fitAddon = new FitAddon()

const pty = require('node-pty')

const shell = process.env[os.platform() === 'win32' ? 'powershell.exe' : 'bash']
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
    protected base: string = ''
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
        xterm.loadAddon(new WebLinksAddon())
        const searchAddon = new SearchAddon()
        xterm.loadAddon(searchAddon)

        xterm.open(this.$refs.xterm as HTMLElement)

        const active = xterm.buffer.active
        const line = active.getLine(active.cursorY).translateToString()
        console.log('[line]', line)
        fitAddon.fit()

        motx.subscribe('run', (val) => {
            if (val[val.length - 1] !== '\n') {
                ptyProcess.write(val + '\n')
            } else {
                ptyProcess.write(val)
            }
            xterm.focus()
        })

        // onKey onCursorMove onLineFeed onScroll onSelectionChange onRender onResize onTitleChange
        xterm.onRender((data) => {
            console.log('[onRender]', data)
        })
        xterm.onSelectionChange((data) => {
            console.log('[onSelectionChange]', data)
        })
        xterm.onLineFeed((data) => {
            console.log('[onLineFeed]', data)
        })
        xterm.onCursorMove((data) => {
            console.log('[onCursorMove]', data)
        })
        xterm.onKey((data) => {
            console.log('[onKey]', data)
        })
        xterm.onData((data) => {
            const active = xterm.buffer.active
            const line = active.getLine(active.cursorY).translateToString()
            console.log('[onData]', line)
            ptyProcess.write(data)
        })

        ptyProcess.on('data', function(data) {
            const line = data.toString()
            console.log('[ptyProcess]', line)
            line.trim().split()

            xterm.write(line)

            setTimeout(() => {
                const active = xterm.buffer.active
                const line = active.getLine(active.cursorY).translateToString()
                if (!this.base) {
                    this.base = line.trim()
                    console.log(this.base)
                }
            })
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
