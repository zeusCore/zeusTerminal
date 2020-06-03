<template>
    <section
        class="terminal-wrapper hover-area"
        :style="{ height: height + 'px' }"
        flex="dir:top box:first"
        @click="handleWrapperClick"
        :class="{
            focus: iFocused
        }"
    >
        <XTermHeader :term="term" :editMode="editMode" />
        <XTerm :term="term" v-show="!editMode"></XTerm>
        <CEdit
            :cmd="editCmd"
            :terminalId="term.id"
            @submited="handleSubmited"
            v-if="editMode"
        ></CEdit>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'
import XTerm from './components/XTerm.vue'
import CEdit from './components/Edit.vue'
import XTermHeader from './components/XTermHeader.vue'

@Component({ components: { XTerm, CEdit, XTermHeader } })
export default class Terminal extends Vue {
    @State('focused') focused: number[] = []

    @Prop({
        default: () => ({})
    })
    protected term: PlainObject
    @Prop({
        default: 160
    })
    protected height: number

    protected editMode: boolean = false
    protected editCmd = {}
    protected $handlers: PlainObject

    protected get iFocused() {
        return this.focused.includes(this.term.id)
    }

    mounted() {
        this.$handlers = {}
        this.focused = motx.getState('focused')
        motx.setState('focused', [this.term.id])
        this.$handlers.edit = (id, cmd: ICmd) => {
            if (id === this.term.id) {
                this.editCmd = cmd
                this.editMode = true
            }
        }

        motx.subscribe('edit-script', this.$handlers.edit)
    }
    beforeDestroy() {
        motx.unsubscribe('edit-script', this.$handlers.edit)
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
.platform-win32
  .terminal-wrapper
    opacity 0.9
    &.focus
      opacity 1
.terminal-wrapper
  width 100%
  height 100%
  float left
  min-height 160px
  border 1px rgba(255, 255, 255, 0.2) solid
  opacity 0.8
  transition opacity 0.2s
  &.focus
    opacity 0.9
    border 1px rgba(255, 255, 255, 0.3) solid
    .xterm-header
      .left
        color #fff
</style>
