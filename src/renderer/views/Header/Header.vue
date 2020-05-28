<template>
  <section class="term-header"
           flex>
    <div class="logo">FuckTerminal</div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({ components: {} })
export default class Body extends Vue {
    mounted() {}
}
</script>

<style lang="stylus">
.term-header
  background-color rgba(0, 0, 0, 0.8)
  -webkit-app-region drag
  .logo
    height 30px
    color #ccc
    padding 7px 10px
</style>
