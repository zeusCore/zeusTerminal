<template>
  <section id="fuck-input-tips"
           class="fuck-input-tips">
    <ul>
      <li>git commit </li>
      <li>git commit </li>
      <li>git commit </li>
      <li>git commit </li>
      <li>git commit </li>
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
  position fixed
  left 100px
  top 100px
  z-index 1000
  background-color rgba(0, 0, 0, 0.7)
  border solid 1px rgba(255, 255, 255, 0.2)
  box-shadow 0 0 10px rgba(0, 0, 0, 0.6)
  ul
    li
      padding 2px 10px
      color #fff
</style>
