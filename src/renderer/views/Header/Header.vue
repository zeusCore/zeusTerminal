<template>
  <section class="term-header">
    <Topbar></Topbar>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Topbar from './components/Topbar.vue'
@Component({ components: { Topbar } })
export default class Body extends Vue {
    mounted() {}
}
</script>

<style lang="stylus">
.term-header
  background-color rgba(255, 255, 255, 0.05)
  -webkit-app-region drag
  .logo
    height 30px
    color #ccc
    padding 7px 10px
</style>
