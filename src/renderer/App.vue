<template>
  <section class="zeus-term-app"
           flex="dir:top box:first">
    <CHeader></CHeader>
    <CBody></CBody>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import CHeader from './views/Header/Header.vue'
import CBody from './views/Body/Body.vue'
import motx from '@/motx'
import 'flex.css'
import '@/assets/font/iconfont.css'
import '@/assets/font/iconfont.js'
import './style/base.styl'

let timo
let timo2
window.addEventListener('resize', () => {
    if (!timo) {
        timo = setTimeout(() => {
            motx.publish('terminal-fit')
            timo = null
        }, 10)
    }
    if (timo2) {
        clearTimeout(timo2)
    }
    timo2 = setTimeout(() => {
        motx.publish('terminal-fit')
        timo2 = null
    }, 100)
})

@Component({ components: { CHeader, CBody } })
export default class App extends Vue {
    mounted() {}
}
</script>

<style lang="stylus">
html, body, .zeus-term-app, #app
  height 100%
  background-color transparent
.zeus-term-app
  background-color #000
</style>
