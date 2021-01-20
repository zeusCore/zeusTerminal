<template>
    <section class="terminal-edit" flex="dir:top box:first">
        <div class="label">
            <input type="text" v-model="label" placeholder="Add a label" />
        </div>
        <textarea
            ref="textarea"
            placeholder="


Prepare the commands you want to execute in this terminal."
        ></textarea>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import motx from '@/motx'
declare const CodeMirror: any

@Component({ components: {} })
export default class TerminalEditor extends Vue {
    @Prop({
        default: 0
    })
    protected terminalId: number

    @Prop({
        default: () => ({})
    })
    protected cmd: ICmd

    protected label: string = ''
    protected shell: string = ''

    private $editor: any
    private $submitHanlder: any

    mounted() {
        this.initEditor()
        this.label = this.cmd.label
        this.$editor.setValue(this.cmd.shell)
        this.$submitHanlder = (id) => {
            if (id === this.terminalId) {
                motx.publish('save-terminal-cmd', this.terminalId, {
                    id: this.cmd.id,
                    label: this.label,
                    shell: this.shell
                })
                this.$emit('submited')
            }
        }
        motx.subscribe('save-script', this.$submitHanlder)
    }
    beforeDestroy() {
        motx.unsubscribe('save-script', this.$submitHanlder)
    }

    protected initEditor() {
        this.$editor = CodeMirror.fromTextArea(this.$refs.textarea, {
            mode: 'shell',
            height: '100%',
            lineNumbers: true,
            matchBrackets: true,
            theme: 'base16-dark',
            extraKeys: {
                Enter: 'newlineAndIndentContinueMarkdownList'
            }
        })

        this.$editor.on('change', (e) => {
            const art = e.getValue()
            this.shell = art
        })
    }
}
</script>
<style lang="stylus">
.terminal-edit
  height 100%
  overflow auto
  .label
    padding 10px
    input
      background-color rgba(255, 255, 255, 0.1)
      border none
      height 30px
      width 200px
      padding 0 10px
      line-height 30px
      color #ccc
</style>
