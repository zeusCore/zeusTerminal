<template>
  <section class="terminal-header"
           flex="main:justify">
    <ul class="t-h-left"
        flex>
      <li><i class="icon icon-col-2"></i></li>
      <li><i class="icon icon-col-3"></i></li>
    </ul>
    <ul class="t-h-right"
        flex>
      <li @click="handleAdd"><i class="icon icon-add"></i></li>
    </ul>

  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import motx from '@/motx'

@Component({ components: {} })
export default class TerminalsHeader extends Vue {
    mounted() {}
    protected handleAdd() {
        motx.publish('add-terminal', { index: 0 })
    }
}
</script>

<style lang="stylus">
.terminal-header
  background-color rgba(0, 0, 0, 0.8)
  color #999
  ul
    li
      padding 3px 6px
      cursor pointer
      &:hover
        background-color rgba(255, 255, 255, 0.1)
</style>
