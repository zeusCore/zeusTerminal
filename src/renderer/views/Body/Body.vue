<template>
  <section class="term-body"
           flex="box:last">

    <div class="terminals-wrapper"
         flex="dir:top box:first">
      <TerminalsHeader></TerminalsHeader>
      <div class="terminals">
        <Draggable v-model="terminals"
                   ghost-class="ghost-terminal"
                   :forceFallback="true"
                   handle=".term-drag-handler"
                   :componentData="{attrs:{flex: 'dir:top box:mean'}}"
                   group="terminals"
                   animation:="150"
                   @end="onDragEnd">
          <CTerminal v-for="(item) in terminals"
                     :term="item"
                     :key="item.id" />
        </Draggable>
      </div>
    </div>
    <CEditer />
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

    mounted() {
        this.terminals = motx.getState('terminals')
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
    width calc(100% - 400px)
    height 100%
  .terminals
    width 100%
    height 100%
    overflow auto
  .term-editor
    min-width 400px
</style>
