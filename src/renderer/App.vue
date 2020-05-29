<template>
  <section class="fuck-term-app"
           flex="dir:top box:first">
    <CHeader></CHeader>
    <CBody></CBody>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import CHeader from './views/Header/Header.vue'
import CBody from './views/Body/Body.vue'
import 'flex.css'
import '@/assets/font/iconfont.css'
import '@/assets/font/iconfont.js'
import './style/base.styl'

@Component({ components: { CHeader, CBody } })
export default class App extends Vue {
    mounted() {}
}
</script>

<style lang="stylus">
html, body, .fuck-term-app, #app
  height 100%
  background-color transparent
.fuck-term-app
  background-color rgba(0, 0, 0, 0.6)
</style>
