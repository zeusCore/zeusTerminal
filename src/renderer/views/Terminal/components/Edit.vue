<template>
  <section class="terminal-edit">
    <textarea ref="textarea"
              placeholder="

Enter the default commands of this terminal.

[wait-seconds] is supported.
[wait-2]: wait 2 seconds, [wait-10]: wait 10 seconds"></textarea>
  </section>
</template>
å
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import motx from '@/motx'
import { cleanCmds } from '@/lib'
declare const CodeMirror: any

@Component({ components: {} })
export default class TerminalEditor extends Vue {
    @Prop({
        default: () => ({})
    })
    protected term: PlainObject
    protected input: string = ''
    protected cmds: string = ''

    private $editor: any
    private $submitHanlder: any

    protected get cmdsTips() {
        const cmds = cleanCmds(this.cmds)
        if (cmds) {
            return cmds
                .split(/\n/g)
                .join(' ')
                .substr(0, 50)
        } else {
            return ''
        }
    }

    mounted() {
        this.initEditor()
        this.input = this.term.title
        this.$editor.setValue(this.term.cmds)
        this.$submitHanlder = (id) => {
            if (id === this.term.id) {
                this.submit()
            }
        }
        motx.subscribe('save-script', this.$submitHanlder)
    }
    beforeDestroy() {
        motx.unsubscribe('save-script', this.$submitHanlder)
    }

    protected submit() {
        const terms = motx.getState('terminals')
        const target = terms.find((item) => item.id === this.term.id)
        Object.assign(target, {
            cmds: this.cmds,
            title: this.input
        })
        motx.setState('terminals', terms)
        this.$emit('submited')
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
            this.cmds = art
        })
    }
}
</script>
<style lang="stylus">
headerHeight = 28px
.terminal-wrapper
  &.focus
    .te-header
      .te-title-input
        background-color rgba(255, 255, 255, 0.1)
  .terminal-edit
    height 100%
    overflow auto
  .te-header
    padding 0
    .te-submit
      line-height headerHeight
      padding 0 10px
      color #ccc
      cursor pointer
      background-color rgba(255, 255, 255, 0.3)
      transition background 0.2s
      &:hover
        background-color rgba(255, 255, 255, 0.2)
    .te-cmds-tips
      line-height headerHeight
      text-align center
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
      padding 0 10px
      color #666
      span
        padding 0 10px
    .te-title-input
      height headerHeight
      line-height headerHeight
      background-color rgba(0, 0, 0, 0.3)
      border 1px solid rgba(255, 255, 255, 0)
      color #cccccc
      font-size 13px
      padding-left 20px
  .te-editor-wrapper
    padding-top 10px
    height calc(100% -10px)
    .CodeMirror
      height 100%
      font-family Menlo, Monaco, 'Courier New', monospace
</style>
