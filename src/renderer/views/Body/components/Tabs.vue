<template>
  <section class="tabs"
           flex="box:mean">

    <div v-for="(item, i) in terminals"
         @click="handleFocus(item)"
         :class="{active: focused.includes(item.id)}"
         :key="item.id">{{item.title}}</div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'

@Component({ components: {} })
export default class Tabs extends Vue {
    @State('terminals') terminals: PlainObject[] = []
    @State('focused') focused: number[] = []

    mounted() {
        this.terminals = motx.getState('terminals')
        this.focused = motx.getState('focused')
    }
    handleFocus(term) {
        motx.setState('focused', [term.id])
    }
}
</script>

<style lang="stylus">
.tabs
  background-color rgba(255, 255, 255, 0.1)
  color #999
  div
    background-color #333
    padding 0 15px
    height 24px
    line-height 24px
    text-align left
    color #999
    cursor pointer
    &:hover
      background-color #555
    &.active
      color #fff
      background-color #666
</style>
