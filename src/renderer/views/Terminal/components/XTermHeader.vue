<template>

  <section class="xterm-header"
           flex="mian:justify box:mean">
    <div class="left">
      <div class="term-drag-handler"><i class="icon icon-drag"></i></div>
      <div class="title"
           v-if="term.title">{{term.title}}</div>
      <input class="input-title"
             placeholder="Not Labeled"
             type="text"
             v-model="title"
             @change="handleTitleChange"
             v-else />
    </div>
    <div class="right"
         flex="dir:right ">
      <div class="term-btn"><i class="icon icon-more"></i></div>
    </div>
  </section>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import motx from '@/motx'

@Component({ components: {} })
export default class XTerm extends Vue {
    @Prop({
        default: () => ({})
    })
    protected term: PlainObject

    protected title: string = ''

    protected handleTitleChange(e) {
        motx.publish('update-terminal', { id: this.term.id, title: this.title })
    }
}
</script>

<style lang="stylus">
.terminal-wrapper
  &.focus
    .xterm-wrapper
      .xterm-header
        opacity 1
        background-color rgba(0, 0, 0, 1)
.xterm-wrapper
  width 100%
  height 100%
  .xterm-header
    width 100%
    line-height 20px
    padding 0
    font-size 13px
    background-color rgba(0, 0, 0, 1)
    opacity 1
    .left
      height 20px
      color #ccc
      &>div, &>input
        display inline-block
        float left
      .term-drag-handler
        height 100%
        overflow hidden
        padding 0 4px
        cursor move
      .input-title
        background-color rgba(255, 255, 255, 0.1)
        border none
        color #eee
        font-size 13px
        width calc(100% - 40px)
        height 100%
        padding 0 10px
        &::placeholder
          color #666
      .title
        height 100%
        text-overflow ellipsis
        font-size 13px
        overflow hidden
        white-space nowrap
    .right
      .term-btn
        padding 0 10px
        color #ccc
        transition background 0.2s
        cursor pointer
        border-bottom-left-radius 5px
        i
          font-size 13px
        &:hover
          background-color rgba(255, 255, 255, 0.1)
</style>
