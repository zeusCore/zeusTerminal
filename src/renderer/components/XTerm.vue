<template>

  <section class="fuck-xterm-wrapper">
    <section class="fuck-xterm-area"
             ref="xterm"></section>
    <CTips />
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
    protected base: string = ''
    protected recommendFocused: boolean = false
    mounted() {
        this.init()
    }
    init() {
        const xterm = new Terminal({
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
        window.addEventListener('resize', () => {
            fitAddon.fit()
        })

        motx.subscribe('run', (val: string) => {
            val = val.trimStart()
            if (val[val.length - 1] !== '\n') {
                ptyProcess.write(val + '\n')
            } else {
                ptyProcess.write(val)
            }
            xterm.focus()
        })

        // onKey onCursorMove onLineFeed onScroll onSelectionChange onRender onResize onTitleChange

        xterm.onLineFeed((data) => {
            console.log('[onLineFeed]', arguments)
        })
        xterm.addMarker(1)
        xterm.addMarker(2)
        xterm.onKey((data) => {
            const code = data.domEvent.code
            console.log('[onKey]', code)
            if (
                ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(
                    code
                )
            ) {
                xterm.blur()
                this.recommendFocused = true
                motx.publish('xterm-onkey', code)
            }
        })
        xterm.onData((data) => {
            const active = xterm.buffer.active
            const line = active.getLine(active.cursorY).translateToString()
            active.type
            setTimeout(() => {
                xterm.refresh(active.cursorY, active.cursorY)
            }, 1000)
            console.log(line)
            ptyProcess.write(data)
        })

        ptyProcess.on('data', function(data) {
            const line = data.toString()
            line.trim().split()
            console.log('xterm.write(line)', line)
            xterm.write(line)
            // xterm.paste('9988')
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
    margin 10px
    height calc(100% - 120px)
</style>
