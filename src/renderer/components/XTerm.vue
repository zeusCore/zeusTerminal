<template>

  <section class="fuck-xterm-wrapper"
           @click="handleWrapperClick">
    <section class="fuck-xterm-area"
             ref="xterm"></section>
    <CTips />
  </section>

</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Terminal } from '../assets/static/xterm/src/browser/public/Terminal'
import os from 'os'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'
import CTips from './Tips.vue'

const pty = require('node-pty')

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
const env = process.env
env['LC_ALL'] = 'zh_CN.UTF-8'
env['LANG'] = 'zh_CN.UTF-8'
env['LC_CTYPE'] = 'zh_CN.UTF-8'
const fitAddons = []

window.addEventListener('resize', () => {
    fitAddons.forEach((item) => {
        item && item.fit()
    })
})
@Component({ components: { CTips } })
export default class XTerm extends Vue {
    @State('currentIndex') currentIndex: number = -1
    @State('currentInput') currentInput: string = ''

    protected base: string = ''
    protected input: string = ''
    protected arrowIndex: number = 0
    protected recommendFocused: boolean = false
    protected $xterm: Terminal
    protected $pty: any
    protected $fixAddon: any
    protected $resizeHandler: any

    @Watch('currentInput') currentInputWacher(val) {
        if (this.input !== val) {
            this.setInput(val)
        }
    }

    mounted() {
        this.init()
    }

    beforeDestroy() {
        fitAddons.splice(fitAddons.indexOf(this.$fixAddon), 1)
    }

    handleWrapperClick() {
        motx.publish('xterm-click')
    }

    init() {
        const ptyProcess = (this.$pty = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.cwd(),
            env: env,
            encoding: null
        }))

        const fitAddon = (this.$fixAddon = new FitAddon())
        fitAddons.push(fitAddon)

        const xterm = (this.$xterm = new Terminal({
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
        }))

        xterm.loadAddon(fitAddon)
        xterm.loadAddon(new WebLinksAddon())

        xterm.open(this.$refs.xterm as HTMLElement)

        fitAddon.fit()

        motx.subscribe('run', (val: string) => {
            val = val.trimStart()
            if (val[val.length - 1] !== '\n') {
                ptyProcess.write(val + '\n')
            } else {
                ptyProcess.write(val)
            }
            xterm.focus()
        })

        motx.subscribe('xterm-focus-from-tips', () => {
            if (this.input !== this.currentInput) {
                this.setInput(this.input)
                motx.setState('currentInput', this.input)
                this.arrowIndex = 0
            }
        })

        setTimeout(() => {
            this.base = this.getActiveLine().trim() + ' '
        }, 200)
        xterm.onLineFeed(() => {
            setTimeout(() => {
                const line = this.getActiveLine().trim()
                const prev = line.split(/[\$\%\>]/)[0]
                this.base = prev + line.substr(prev.length, 1) + ' '
                this.arrowIndex = 0
                this.input = ''
                console.log({ line, prev, base: this.base })
            }, 100)
        })

        xterm.onKey((data) => {
            const code = data.domEvent.code
            console.log('[onKey]', code)
            if (['ArrowDown', 'ArrowUp'].includes(code)) {
                if (code === 'ArrowDown') {
                    if (this.arrowIndex > -1) {
                        this.arrowIndex--
                    }
                } else {
                    this.arrowIndex++
                }
                if (this.arrowIndex === -1) {
                    xterm.blur()
                    this.recommendFocused = true
                    motx.publish('xterm-onkey', code)
                    // setTimeout(() => {
                    //     this.setInput('ls')
                    // }, 3000)
                }
            }
        })
        xterm.onData((data) => {
            console.log(
                '[onData]',
                data,
                data.split('').map((item) => item.charCodeAt(0))
            )
            ptyProcess.write(data)
        })

        ptyProcess.on('data', (data) => {
            let line: string = data.toString()
            if (this.base) {
                line = line
                    .split(this.base.trim())
                    .join(`\x1b[33m${this.base.trim()}\x1b[0m`)
            }
            xterm.write(line)
            if (this.base.length && this.arrowIndex > -1) {
                setTimeout(() => {
                    const line: string = this.getActiveLine().trim()
                    const input = line.substr(this.base.length).trim()
                    if (this.input !== input) {
                        this.input = input
                        motx.publish('xterm-input', this.input)
                        console.log('[this.input]', this.input)
                    }
                }, 10)
            }
        })

        motx.subscribe('xterm-focus-from-tips', (cmd) => {
            xterm.focus()
            this.arrowIndex = 0
            if (cmd) {
                this.setInput(cmd)
            }
        })
    }

    protected async getInput() {
        let line = this.getActiveLine()
        line = line.trim()
        await this.clearInput()
        const empty = this.getActiveLine().trim()
        const input = line.substring(empty.length)
        this.setInput(input)
        return input
    }

    protected getActiveLine() {
        const active = this.$xterm.buffer.active
        const line = active
            .getLine(active.baseY + active.cursorY)
            .translateToString()
        return line
    }

    protected setInput(text, ln?: boolean) {
        return new Promise((r) => {
            this.clearInput().then(() => {
                this.$pty.write(text)
                if (ln) {
                    this.$pty.write('\n')
                }
                setTimeout(r, 10)
            })
        })
    }

    protected cancelInput() {
        return new Promise((r) => {
            this.$pty.write(String.fromCharCode(3))
            setTimeout(r, 10)
        })
    }
    protected clearInput() {
        return new Promise((r) => {
            const active = this.$xterm.buffer.active
            let line = active.getLine(active.cursorY).translateToString()
            line = line.substr(this.base.length - 1)
            line.split('').forEach(() => {
                this.$pty.write(String.fromCharCode(127))
            })
            setTimeout(r, 10)
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
