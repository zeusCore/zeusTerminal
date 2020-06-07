<template>
    <section class="xterm-header rc-header" flex="mian:justify box:mean">
        <div class="left">
            <div class="term-drag-handler hover-show">
                <i class="icon icon-drag"></i>
            </div>
            <div class="title">
                {{ term.title }}
            </div>
        </div>
        <div class="right" flex="main:right ">
            <div
                class="term-btn"
                @click="handleAction('close-controled', term.cnnid)"
            >
                <i style="font-size: 16px;" class="icon icon-remove"></i>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import motx from '@/motx'
@Component({ components: {} })
export default class XTerm extends Vue {
    @Prop({
        default: () => ({})
    })
    protected term: PlainObject

    protected handleAction(action, arg) {
        motx.publish(action, this.term.id, arg)
    }
}
</script>

<style lang="stylus">
.rc-header
    background-color rgba(255, 0, 0,.2)
</style>
