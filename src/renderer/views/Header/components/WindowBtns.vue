
<template>

  <div class="window-btns"
       id="webview-caidan"
       flex>
    <button aria-label="minimize"
            title="Minimize"
            tabindex="-1"
            @click="onMinimize()"
            v-if="isMinimizable">
      <i class="iconfont iconhide"></i>
    </button>
    <button aria-label="maximize"
            title="Maximize"
            tabindex="-1"
            @click="onMaximize()"
            v-if="isMaximizable">
      <i class="iconfont iconzoom"></i>
    </button>
    <button aria-label="close"
            title="Close"
            tabindex="-1"
            class="close"
            @click="onClose()"
            v-if="isClosable">
      <i class="iconfont iconclose_tab"></i>
    </button>
  </div>
</template>
<script lang='ts'>
import { Vue, Component, Prop } from 'vue-property-decorator'
import motx from '@/motx'
import caidan from '@/common/caidan'

@Component({
    components: {}
})
export default class WindowBtns extends Vue {
    @Prop({ type: String, default: 'home' }) window
    @Prop({ type: Boolean, default: true }) isMinimizable
    @Prop({ type: Boolean, default: true }) isMaximizable
    @Prop({ type: Boolean, default: true }) isClosable
    mounted() {
        caidan.bind('#webview-caidan', () => {
            motx.publish('open-webview-devtool', {})
        })
    }
    protected onMinimize() {
        motx.pipe('main').publish('window-min', { target: this.window })
        // ipcRenderer.send(`window.minimize`, this.window)
    }
    protected onMaximize() {
        motx.pipe('main').publish('window-max', { target: this.window })
        // ipcRenderer.send(`window.maximize`, this.window)
    }
    protected onClose() {
        motx.pipe('main').publish('window-close', { target: this.window })
        // ipcRenderer.send(`window.close`, this.window)
    }
}
</script>
<style lang="stylus" scoped>
.window-btns
  display inline-block
  height 100%
  color #2c2c2c
  padding 12px 8px
  float right
  -webkit-app-region no-drag
  button
    position relative
    z-index 2
    display inline-block
    position relative
    width 26px
    height 26px
    padding 0
    margin-right 3px
    overflow hidden
    border none
    box-shadow none
    border-radius 13px
    background-color transparent
    line-height 26px
    outline none
    cursor pointer
    transition all 0.2s
    i
      font-size 24px
      color #808b94
      cursor pointer
      display inline-block
    &:hover
      background-color #dde2ea
    &.close:hover
      background-color #FF5C5C
      i
        color #fff
</style>