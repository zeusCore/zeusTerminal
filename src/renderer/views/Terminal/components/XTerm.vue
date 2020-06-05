<template>
  <section class="xterm-wrapper">
    <section class="xterm-area"
             @click="handleWrapperClick"
             ref="xterm"></section>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from './WebLinksAddon'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'
import CTips from './Tips.vue'
import { cleanCmds } from '@/lib'
import getPty from './pty'

import { IPty } from 'node-pty'

@Component({ components: { CTips } })
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
    protected $handlers: PlainObject

    protected get iFocused() {
        return this.focused.includes(this.term.id)
    }

    mounted() {
        this.$handlers = {}
        this.init()
        this.focused = motx.getState('focused')
        this.$xterm.focus()
    }

    beforeDestroy() {
        this.$xterm.dispose()
        this.$pty.kill()
        motx.unsubscribe('terminal-fit', this.$handlers.fit)
        motx.unsubscribe('run-from-edit', this.$handlers.runFromEditor)
        motx.unsubscribe('run-script', this.$handlers.run)
    }

    handleWrapperClick() {
        motx.setState('focused', [this.term.id])
    }

    init() {
        const ptyProcess = (this.$pty = getPty())

        const xterm = (this.$xterm = new Terminal({
            rows: 30,
            fontSize: 12,
            lineHeight: 1.2,
            fontFamily: `zeusMenlo, Menlo, Monaco, 'Courier New', monospace`,
            rendererType: 'canvas',
            theme: {
                foreground: '#ccc',
                background: '#000',
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
        }, 500)

        this.$handlers.fit = () => {
            fitAddon.fit()
            ptyProcess.resize(xterm.cols, xterm.rows)
        }

        this.$handlers.run = (id, shell) => {
            if (id === this.term.id) {
                ptyProcess.write(cleanCmds(shell) + '\r')
            }
        }
        this.$handlers.runFromEditor = (val) => {
            if (this.iFocused) {
                val = val.trimStart()
                if (val[val.length - 1] !== '\r') {
                    ptyProcess.write(val + '\r')
                } else {
                    ptyProcess.write(val)
                }
                xterm.focus()
            }
        }

        motx.subscribe('terminal-fit', this.$handlers.fit)
        motx.subscribe('run-script', this.$handlers.run)
        motx.subscribe('run-from-edit', this.$handlers.runFromEditor)

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
  padding 5px
  .xterm-area
    height 100%
</style>
