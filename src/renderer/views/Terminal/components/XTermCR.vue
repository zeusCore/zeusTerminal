<template>
  <section class="xterm-wrapper">
    <section class="xterm-area"
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
import ControlRemote from '@/lib/ControlRemote'

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
    protected $fixAddon: any
    protected $controlRemote: any

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
        this.$controlRemote = new ControlRemote(this.term.cnnid)
        this.init()
        this.focused = motx.getState('focused')
        this.$xterm.focus()
    }

    beforeDestroy() {
        this.$xterm.dispose()
        motx.unsubscribe('terminal-fit', this.$handlers.fit)
        motx.unsubscribe('run-from-edit', this.$handlers.runFromEditor)
    }

    init() {
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
            this.$controlRemote.resize(xterm.cols, xterm.rows)
        }, 500)

        this.$handlers.fit = () => {
            fitAddon.fit()
            this.$controlRemote.resize(xterm.cols, xterm.rows)
        }

        this.$handlers.runFromEditor = (val) => {
            if (this.iFocused) {
                val = val.trimStart()
                if (val[val.length - 1] !== '\r') {
                    this.$controlRemote.send(val + '\r')
                } else {
                    this.$controlRemote.send(val)
                }
                xterm.focus()
            }
        }

        this.$handlers.close = (id, cnnid) => {
            if (cnnid === this.term.cnnid) {
                this.$controlRemote.disconnect()
            }
        }

        motx.subscribe('terminal-fit', this.$handlers.fit)
        motx.subscribe('run-from-edit', this.$handlers.runFromEditor)
        motx.subscribe('close-connection', this.$handlers.close)

        xterm.onData((data) => {
            this.$controlRemote.send(data)
        })

        this.$controlRemote.on('data', (data) => {
            xterm.write(data)
        })
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
