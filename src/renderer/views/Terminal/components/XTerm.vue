<template>

  <section class="xterm-wrapper"
           flex="dir:top box:first">
    <XTermHeader :term="term" />
    <section class="xterm-area"
             @click="handleWrapperClick"
             ref="xterm"></section>
  </section>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Terminal } from 'xterm'
import os from 'os'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from './WebLinksAddon'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'
import CTips from './Tips.vue'
import XTermHeader from './XTermHeader.vue'

import { spawn, IPty } from 'node-pty'

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
const env = process.env
env['LC_ALL'] = 'zh_CN.UTF-8'
env['LANG'] = 'zh_CN.UTF-8'
env['LC_CTYPE'] = 'zh_CN.UTF-8'

let timo
window.addEventListener('resize', () => {
    if (!timo) {
        timo = setTimeout(() => {
            motx.publish('terminal-fit')
            timo = null
        }, 10)
    }
})

@Component({ components: { CTips, XTermHeader } })
export default class XTerm extends Vue {
    @State('focused') focused: number[] = []

    @Prop({
        default: () => ({})
    })
    protected term: PlainObject

    protected base: string = ''
    protected input: string = ''
    protected inputLine: string = ''

    protected $xterm: Terminal
    protected $pty: IPty
    protected $fixAddon: any
    protected $resizeHandler: any

    protected preKeydown: string = ''

    protected bsMode: boolean = false
    protected toSetInput: string = ''
    protected checkInput: any

    protected get iFocused() {
        return this.focused.includes(this.term.id)
    }

    mounted() {
        this.init()
        this.focused = motx.getState('focused')
        this.$xterm.focus()
    }

    beforeDestroy() {
        this.$xterm.dispose()
        this.$pty.kill()
    }

    handleWrapperClick() {
        motx.setState('focused', [this.term.id])
    }

    init() {
        const ptyProcess = (this.$pty = spawn(shell, ['--login'], {
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
            rendererType: 'canvas',
            theme: {
                foreground: '#ccc',
                cursor: 'rgb(254,239,143)'
            }
        }))

        const fitAddon = (this.$fixAddon = new FitAddon())

        xterm.loadAddon(fitAddon)
        xterm.loadAddon(new WebLinksAddon())
        xterm.open(this.$refs.xterm as HTMLElement)

        setTimeout(() => {
            fitAddon.fit()
            ptyProcess.resize(xterm.cols, xterm.rows)
        }, 50)

        motx.subscribe('terminal-fit', (val: string) => {
            fitAddon.fit()
            ptyProcess.resize(xterm.cols, xterm.rows)
        })

        motx.subscribe('run', (val: string) => {
            if (this.iFocused) {
                val = val.trimStart()
                if (val[val.length - 1] !== '\n') {
                    ptyProcess.write(val + '\n')
                } else {
                    ptyProcess.write(val)
                }
                xterm.focus()
            }
        })

        xterm.onData((data) => {
            ptyProcess.write(data)
        })

        ptyProcess.on('data', (data: any) => {
            xterm.write(data)
        })
    }

    protected setInput(text, ln?: boolean) {
        this.toSetInput = text
        this.clearInput()
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
.xterm-wrapper
  width 100%
  height 100%
  .xterm-area
    height 100%
    padding 5px
    background-color #000
    .xterm-viewport
      background-color transparent !important
</style>
