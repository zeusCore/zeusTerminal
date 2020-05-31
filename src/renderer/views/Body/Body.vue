<template>
  <section class="term-body">

    <div class="terminals-wrapper"
         flex="dir:top box:first">
      <TerminalsHeader></TerminalsHeader>
      <div class="terminals"
           :class="`column-${columns}`">
        <Draggable v-model="terminals"
                   ghost-class="ghost-terminal"
                   :forceFallback="true"
                   handle=".term-drag-handler"
                   :componentData="{}"
                   group="terminals"
                   animation:="150"
                   @end="onDragEnd">
          <CTerminal v-for="(item) in terminals"
                     :height="terminalHeight"
                     :term="item"
                     :key="item.id" />
        </Draggable>
      </div>
    </div>
    <CEditer v-if="scriptShow"
             :class="scriptShow === 2 ? `show` : ''" />
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CEditer from '../Editor/Editor.vue'
import CTerminal from '../Terminal/Terminal.vue'
import { State } from 'motx/dist/motx-vue'
import motx from '@/motx'
import TerminalsHeader from './components/TerminalsHeader.vue'
import Draggable from 'vuedraggable'

@Component({ components: { CEditer, CTerminal, TerminalsHeader, Draggable } })
export default class Body extends Vue {
    @State('terminals') terminals: PlainObject[] = []
    @State('columns') columns: number = 1

    protected winHeight: number = window.innerHeight
    protected handlers: PlainObject = {}
    protected scriptShow: number = 0

    protected get terminalHeight() {
        const len = this.terminals.length
        const winHeight = this.winHeight
        const minHeight = 160
        const columns = this.columns
        const rows = Math.ceil(len / columns)
        const height =
            (winHeight - 51) / rows > minHeight
                ? (winHeight - 51) / rows
                : minHeight
        return height
    }

    mounted() {
        let scriptShowTimo
        this.handlers.handleScriptShow = (show) => {
            if (scriptShowTimo) {
                clearTimeout(scriptShowTimo)
                scriptShowTimo = null
            }
            if (show) {
                this.scriptShow = 1
                scriptShowTimo = setTimeout(() => {
                    this.scriptShow = 2
                    scriptShowTimo = null
                }, 10)
            } else {
                this.scriptShow = 3
                scriptShowTimo = setTimeout(() => {
                    this.scriptShow = 0
                }, 500)
            }
        }

        this.handlers.terminalFit = () => {
            this.winHeight = window.innerHeight
        }

        this.terminals = motx.getState('terminals')
        this.columns = motx.getState('columns')
        motx.subscribe('terminal-fit', this.handlers.terminalFit)
        motx.subscribe('toggle-script', this.handlers.handleScriptShow)
    }

    protected beforeDestroy() {
        motx.unsubscribe('terminal-fit', this.handlers.terminalFit)
        motx.unsubscribe('toggle-script', this.handlers.handleScriptShow)
    }

    protected onDragEnd(e) {
        console.log(JSON.parse(JSON.stringify(this.terminals)))
        motx.publish('save-terminals', this.terminals)
    }
}
</script>

<style lang="stylus">
.ghost-terminal
  opacity 0.7
.term-body
  .terminals-wrapper
    height 100%
  .terminals
    width 100%
    height 100%
    overflow auto
    &.column-1
      .terminal-wrapper
        width 100%
    &.column-2
      .terminal-wrapper
        width 50%
    &.column-3
      .terminal-wrapper
        width 33.333%
    &.column-4
      .terminal-wrapper
        width 25%
    &>div
      height 100%
      width 100%
</style>
