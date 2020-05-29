<template>

  <section class="terminal-wrapper"
           @click="handleWrapperClick"
           :class="{
                focus: iFocused
            }">
    <XTerm :term="term"
           v-if="!editMode || term.id===1"></XTerm>
    <CEdit :term="term"
           v-else
           @submited="handleSubmited"></CEdit>
  </section>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'
import XTerm from './components/XTerm.vue'
import CEdit from './components/Edit.vue'

@Component({ components: { XTerm, CEdit } })
export default class Terminal extends Vue {
    @State('focused') focused: number[] = []

    @Prop({
        default: () => ({})
    })
    protected term: PlainObject

    protected editMode: boolean = true

    protected get iFocused() {
        return this.focused.includes(this.term.id)
    }

    mounted() {
        this.focused = motx.getState('focused')
        motx.setState('focused', [this.term.id])
    }

    handleSubmited() {
        this.editMode = false
    }

    handleWrapperClick() {
        motx.setState('focused', [this.term.id])
    }
}
</script>

<style lang="stylus">
.terminal-wrapper
  width 100%
  height 100%
  border 1px rgba(255, 255, 255, 0.1) solid
  background-color rgba(0, 0, 0, 0.8)
  opacity 0.8
  transition opacity 0.2s
  &.focus
    opacity 1
    .xterm-header
      .left
        color #fff
</style>
