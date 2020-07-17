<template>
  <section class="term-editor">
    <nav class="tools-bar"
         @mouseenter="handleToolsFixed"
         @mouseover="handleToolsFixed"
         @mouseout="handleToolsToHide"
         :style="toolsStyles">
      <div class="run-btn"
           :disabled="toolsDisabled"
           v-if="toolsShow"
           @click="toRun"><i class="icon icon-run"></i>
        {{ multiLines ? '执行选中行' : '执行当前行' }}</div>
    </nav>

    <section class="editor-wrapper"
             @mouseup="handleMouseUp"
             flex="box:first">
      <div class="editor-handler">

      </div>
      <textarea id="code"></textarea>
    </section>
  </section>
</template>
å
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import motx from '@/motx'
import cmds from '@/data/cmds'
import { cleanCmds } from '@/lib'
declare const CodeMirror: any

window.localStorage.cmds = window.localStorage.cmds || cmds

@Component({ components: {} })
export default class MDEditor extends Vue {
    private $editor: any
    private timo: any
    protected toolsShow: boolean = false
    protected toolsLeft: number = 0
    protected toolsTop: number = 0
    protected toolsDisabled: boolean = true
    protected selected: string = ''

    protected get toolsStyles() {
        return {
            left: this.toolsLeft + 'px',
            top: this.toolsTop + 'px'
        }
    }
    protected get multiLines() {
        return this.selected.split('\n').length > 1
    }
    mounted() {
        // motx.pipe('remote').publish('web-ready', '')
        this.initEditor()
        this.$editor.setValue(window.localStorage.cmds || '')
    }

    protected toRun() {
        if (!this.toolsDisabled) {
            const selected = this.selected
            if (this.selected) {
                motx.publish('run-from-edit', selected)
                this.toolsDisabled = true
            }
            setTimeout(() => {
                this.toolsDisabled = false
            }, 2000)
        }
    }

    protected handleMouseUp(e) {
        setTimeout(() => {
            if (this.timo) {
                clearTimeout(this.timo)
            }
            if (this.selected) {
                this.toolsShow = true
                this.toolsDisabled = false
                this.toolsLeft = e.pageX + 20
                this.toolsTop = e.pageY - 50
                this.timo = setTimeout(() => {
                    this.toolsShow = false
                    this.toolsDisabled = true
                    this.timo = null
                }, 2000)
            } else {
                this.toolsShow = false
                this.toolsDisabled = true
            }
        }, 50)
    }

    protected handleToolsFixed() {
        clearTimeout(this.timo)
        this.timo = null
    }

    protected handleToolsToHide() {
        this.timo = setTimeout(() => {
            this.toolsShow = false
            this.toolsDisabled = true
            this.timo = null
        }, 1000)
    }

    protected initEditor() {
        this.$editor = CodeMirror.fromTextArea(
            document.getElementById('code'),
            {
                mode: 'shell',
                height: '100%',
                lineNumbers: false,
                matchBrackets: true,
                theme: 'base16-dark',
                extraKeys: {
                    Enter: 'newlineAndIndentContinueMarkdownList'
                }
            }
        )

        this.$editor.on('beforeSelectionChange', (e) => {
            setTimeout(() => {
                this.selected = cleanCmds(this.$editor.getSelection())
                if (!this.selected) {
                    const pos = this.$editor.getCursor()
                    const line = this.$editor.getLine(pos.line)
                    this.selected = cleanCmds(line)
                }
                console.log(this.selected)
            }, 30)
        })

        this.$editor.on('change', (e) => {
            const art = e.getValue()
            if (window.localStorage.cmds !== art) {
                window.localStorage.cmds = art || ''
            }
        })
    }
}
</script>
<style lang="stylus">
// 交互样式
.term-editor
  width 100%
  position fixed
  right -100%
  top 47px
  bottom 0
  border solid rgba(255, 255, 255, 1) 1px
  z-index 1000
  transition right 0.3s
  &.show
    right 0
  .tools-bar
    position fixed
    z-index 100
    .run-btn
      display inline-block
      padding 3px
      background-color rgba(255, 255, 255, 0.8)
      border-radius 5px
      color #333
      font-size 12px
      line-height 1
      font-size 12px
      opacity 0.9
      cursor pointer
      &[disabled]
        opacity 0.7
        cursor not-allowed
      &:hover
        opacity 1
      i
        vertical-align text-bottom
  .editor-wrapper
    height 100%
    .editor-handler
      width 5px
      height 100%
      background-color #151515
      cursor col-resize
  .CodeMirror
    color #ddd
    height 100%
    font-family Menlo, Monaco, 'Courier New', monospace
    background-color rgba(0, 0, 0, 1)
</style>
