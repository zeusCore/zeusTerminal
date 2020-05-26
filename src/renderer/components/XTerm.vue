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
import { Terminal } from 'xterm'
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
    fitAddons.forEach((fix) => {
        fix && fix()
    })
})
@Component({ components: { CTips } })
export default class XTerm extends Vue {
    @State('currentIndex') currentIndex: number = -1
    @State('currentInput') currentInput: string = ''

    protected base: string = ''
    protected input: string = ''

    protected $xterm: Terminal
    protected $pty: any
    protected $fixAddon: any
    protected $resizeHandler: any

    protected preKeydown: string = ''
    protected arrowIndex: number = 0

    // check no content
    protected bsMode: boolean = false
    protected toSetInput: string = ''
    protected checkInput: any

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

        const fitAddon = (this.$fixAddon = new FitAddon())

        fitAddons.push(() => {
            console.log(xterm.cols)
            fitAddon.fit()
            console.log(xterm, xterm.cols)
            ptyProcess.resize(xterm.cols, xterm.rows)
        })

        xterm.loadAddon(fitAddon)
        xterm.loadAddon(new WebLinksAddon())
        xterm.open(this.$refs.xterm as HTMLElement)

        setTimeout(() => {
            fitAddon.fit()
            ptyProcess.resize(xterm.cols, xterm.rows)
        }, 50)

        motx.subscribe('run', (val: string) => {
            val = val.trimStart()
            if (val[val.length - 1] !== '\n') {
                ptyProcess.write(val + '\n')
            } else {
                ptyProcess.write(val)
            }
            xterm.focus()
        })

        // setTimeout(() => {
        //     this.base = this.getLastLine().trim() + ' '
        // }, 200)

        xterm.onKey((data) => {
            const code = data.domEvent.code
            console.log('[onKey]', code)
            this.preKeydown = code
            // motx.publish('xterm-keydown', {
            //     code,
            //     keyCode: data.domEvent.keyCode
            // })
        })
        xterm.onData((data) => {
            console.log(
                '[onData]',
                data,
                data.split('').map((item) => item.charCodeAt(0))
            )
            if (
                this.currentIndex > -1 &&
                ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(
                    this.preKeydown
                )
            ) {
                return
            }
            ptyProcess.write(data)
        })

        xterm.onLineFeed(() => {
            const active = this.$xterm.buffer.active
            const newLine = active.getLine(active.baseY + active.cursorY)
            if (newLine && !newLine.isWrapped) {
                var inputdata = this.getLineData(
                    active,
                    active.baseY + active.cursorY - 1
                )
                // parseCmd(inputdata);
                console.log(inputdata)
            } else {
            }
        })

        ptyProcess.on('data', (data) => {
            if (this.preKeydown === 'ArrowDown' && data[0] === 7) {
                motx.setState('currentIndex', 0)
                motx.setState('leftSide', true)
                xterm.write(data)
            } else {
                let line: string = data.toString()
                console.log(
                    line.length,
                    line.split('').map((item) => item.charCodeAt(0))
                )
                if (this.base) {
                    line = line
                        .split(this.base.trim())
                        .join(`\x1b[33m${this.base.trim()}\x1b[0m`)
                }
                xterm.write(line)
            }
        })

        ptyProcess.on('data', (data: number[]) => {
            if (this.bsMode) {
                if (data[0] === 7) {
                    this.$pty.write(this.toSetInput)
                    if (this.checkInput) {
                        this.checkInput(true)
                    }
                } else {
                    if (this.checkInput) {
                        this.checkInput(false)
                    }
                }
            }
        })

        // 还原原来的输入内容
        motx.subscribe('tips-blur', () => {
            if (this.input !== this.currentInput) {
                this.setInput(this.input)
                motx.setState('currentInput', this.input)
                this.arrowIndex = 0
            }
        })

        motx.subscribe('tips-blur', (cmd) => {
            xterm.focus()
            this.arrowIndex = 0
            if (cmd) {
                this.setInput(cmd)
            }
        })
    }

    protected getLastLine() {
        const active = this.$xterm.buffer.active
        const line = active.getLine(active.baseY + active.cursorY)
        return line.translateToString()
    }

    protected setInput(text, ln?: boolean) {
        this.toSetInput = text
        this.clearInput()
    }

    protected getBSLenght(buffer) {
        let len = 0
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] !== 8) {
                break
            } else {
                len++
            }
        }
        return len
    }

    protected cancelInput() {
        return new Promise((r) => {
            this.$pty.write(String.fromCharCode(3))
            setTimeout(r, 10)
        })
    }
    protected clearInput() {
        this.bsMode = true

        this.$pty.write(String.fromCharCode(127))

        this.checkInput = (done) => {
            if (done) {
                this.bsMode = false
                this.checkInput = null
            } else {
                this.clearInput()
            }
        }
    }
    protected getLineData(buffer, lineIndex) {
        let line = buffer.getLine(lineIndex)
        if (!line) {
            return
        }
        let lineData = line.translateToString(true)
        while (lineIndex > 0 && line.isWrapped) {
            line = buffer.getLine(--lineIndex)
            if (!line) {
                break
            }
            lineData = line.translateToString(false) + lineData
        }
        return lineData
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
