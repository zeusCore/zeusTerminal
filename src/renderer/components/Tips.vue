<template>
  <section id="fuck-tips"
           class="fuck-tips"
           flex="box:mean">
    <input type="text"
           @keydown="handleKeydown"
           class="fuck-tips-input"
           id="fuck-tips-input">
    <ul class="recommend-list">
      <li :class="{active:index===currentIndex && leftSide}"
          v-for="(item , index) in recommendList"
          :key="index">{{item}}</li>
    </ul>
    <ul class="history-list">
      <li :class="{active:index===currentIndex && !leftSide}"
          v-for="(item , index) in historyList"
          :key="index">{{item}}</li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'

@Component({ components: {} })
export default class App extends Vue {
    protected active: number = 0
    @State('recommendList') recommendList: string[] = []
    @State('historyList') historyList: string[] = []
    @State('currentIndex') currentIndex: number = -1
    @State('leftSide') leftSide: boolean = true

    @Watch('currentIndex') currentIndexChange(val) {
        console.log('[currentIndex]', val)
    }
    mounted() {
        this.recommendList = motx.getState('recommendList')
        this.historyList = motx.getState('historyList')
        motx.subscribe('tipts-focus', () => {
            document.getElementById('fuck-tips-input').focus()
        })

        motx.subscribe('xterm-input', (text) => {
            if (text) {
            } else {
            }
            console.log(`motx.subscribe('xterm-input'`, text)
        })
    }

    handleKeydown(e) {
        const code = e.code
        console.log('[handleKeydown]', code)
        motx.publish('tips-onkey', code)
    }
}
</script>

<style lang="stylus">
.fuck-tips
  background-color rgba(0, 0, 0, 0.7)
  .fuck-tips-input
    position absolute
    opacity 0
    top -10000
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
