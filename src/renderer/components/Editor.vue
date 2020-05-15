<template>
    <section id="ft-shell-editor" class="ft-shell-editor">
        <header class="tools-bar" flex="dir:right main:right">
            <button :disabled="!selected" @click="toRun">执行</button>
        </header>
        <textarea id="code"></textarea>
    </section>
</template>

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
    protected selected: string = ''

    mounted() {
        // motx.pipe('remote').publish('web-ready', '')
        this.initEditor()
        this.$editor.setValue(window.localStorage.cmds || '')
    }

    protected toRun() {
        const selected = this.selected
        if (this.selected) {
            motx.publish('run', selected)
        }
        setTimeout(() => {
            this.selected = selected
        }, 2000)
        this.selected = ''
    }

    protected handleMDToolsFixed() {
        clearTimeout(this.timo)
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
            }, 100)
        })

        this.$editor.on('click', (e) => {
            setTimeout(() => {
                this.selected = this.$editor.getSelection()
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
.ft-shell-editor
    height 100%
    width 40%
    overflow auto
    position fixed
    right 0
    bottom 0
    top 0
    left 60%
    header
        clear both
        overflow hidden
        background-color #000
        button
            border none
            background rgba(255,255,255,.4)
            padding 3px 10px
            float right
            cursor pointer
            transition background .2s
            &[disabled]
                background rgba(255,255,255,.3)
                cursor not-allowed
                &:hover
                    background rgba(255,255,255,.3)
            &:hover
                background rgba(255,255,255,.6)

    .CodeMirror
        height calc(100% - 40px)
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
