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
  .logo
    height 30px
</style>
