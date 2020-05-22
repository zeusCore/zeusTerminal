<template>
    <section id="fuck-input-tips" class="fuck-input-tips" flex="box:mean">
        <ul class="recommend-list">
            <li class="active">git commit</li>
            <li>
                git
                commitcommitcommitcommitcommitcommitcommitcommitcommitcommitcommitcommit
            </li>
            <li>git commit</li>
            <li>git commit</li>
            <li>git commit</li>
        </ul>
        <ul class="history-list">
            <li>git commit</li>
            <li>git commit</li>
            <li>git commit</li>
            <li>git commit</li>
            <li>git commit</li>
        </ul>
    </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import motx from '@/motx'

@Component({ components: {} })
export default class App extends Vue {
    mounted() {}
}
</script>

<style lang="stylus">
.fuck-input-tips
  background-color rgba(0, 0, 0, 0.7)
  ul
    li
      padding 0 10px
      line-height 20px
      color #eee
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      &.active
        background-color rgba(255, 255, 255, 0.2)
</style>
