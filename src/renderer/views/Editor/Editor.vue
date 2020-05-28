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
           @click="toRun"><i class="icon icon-run"></i></div>
    </nav>
    <section class="editor-wrapper"
             @mouseup="handleMouseUp">
      <textarea id="code"></textarea>
    </section>
  </section>
</template>
å
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import motx from '@/motx'
import cmds from '@/data/cmds'

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
    mounted() {
        // motx.pipe('remote').publish('web-ready', '')
        this.initEditor()
        this.$editor.setValue(window.localStorage.cmds || '')
    }

    protected toRun() {
        if (!this.toolsDisabled) {
            const selected = this.selected
            if (this.selected) {
                motx.publish('run', selected)
                this.toolsDisabled = true
            }
            setTimeout(() => {
                this.toolsDisabled = false
            }, 2000)
        }
    }

    protected handleMouseUp(e) {
        if (this.timo) {
            clearTimeout(this.timo)
        }
        this.toolsShow = true
        this.toolsDisabled = false
        this.toolsLeft = e.pageX + 20
        this.toolsTop = e.pageY - 50
        this.timo = setTimeout(() => {
            this.toolsShow = false
            this.toolsDisabled = true
            this.timo = null
        }, 2000)
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
        }, 2000)
    }

    protected initEditor() {
        this.$editor = CodeMirror.fromTextArea(
            document.getElementById('code'),
            {
                mode: 'shell',
                height: '100%',
                lineNumbers: true,
                matchBrackets: true,
                theme: 'base16-dark',
                extraKeys: {
                    Enter: 'newlineAndIndentContinueMarkdownList'
                }
            }
        )

        this.$editor.on('beforeSelectionChange', (e) => {
            setTimeout(() => {
                this.selected = this.$editor.getSelection()
                if (!this.selected) {
                    const pos = this.$editor.getCursor()
                    const line = this.$editor.getLine(pos.line)
                    this.selected = line.trim()
                }
                console.log(this.selected)
            }, 100)
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
  height 100%
  .tools-bar
    position fixed
    z-index 100
    .run-btn
      display inline-block
      padding 3px
      background-color rgba(255, 255, 255, 0.7)
      border-radius 5px
      color #333
      font-size 12px
      line-height 1
      opacity 0.5
      cursor pointer
      &[disabled]
        opacity 0.5
        cursor not-allowed
      &:hover
        opacity 1
  .editor-wrapper
    height 100%
  .CodeMirror
    height 100%
    pre
      &.book-link
        .cm-link, .cm-url
          cursor pointer
        &:hover
          .cm-link, .cm-url
            color #e08527
      &.no-link
        .cm-link, .cm-url
          text-decoration none
</style>
