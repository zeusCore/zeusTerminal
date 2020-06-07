<template>
    <section
        class="terminal-wrapper cr-terminal hover-area"
        :style="{ height: height + 'px' }"
        flex="dir:top box:first"
        @click="handleWrapperClick"
        :class="{
            focus: iFocused
        }"
    >
        <XTermHeader :term="term" />
        <XTerm :term="term"></XTerm>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'
import XTerm from './components/XTermCR.vue'
import XTermHeader from './components/XTermCRHeader.vue'

@Component({ components: { XTerm, XTermHeader } })
export default class CRTerminal extends Vue {
    @State('focused') focused: number[] = []

    @Prop({
        default: () => ({})
    })
    protected term: PlainObject
    @Prop({
        default: 160
    })
    protected height: number

    protected $handlers: PlainObject

    protected get iFocused() {
        return this.focused.includes(this.term.id)
    }

    mounted() {
        this.$handlers = {}
        this.focused = motx.getState('focused')
        motx.setState('focused', [this.term.id])
    }

    handleWrapperClick() {
        motx.setState('focused', [this.term.id])
    }
}
</script>

<style lang="stylus"></style>
