<template>

  <div class="dropdown"
       @mouseover="handleMouseOver"
       @mouseleave="handleMouseLeave"
       :class="{active: active}">
    <div class="dropdown-btn"
         @click="handleBtnClick">
      <slot name="btn"></slot>
    </div>
    <ul class="dropdown-list"
        flex="dir:top">
      <slot name="list"></slot>
    </ul>
  </div>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ components: {} })
export default class XTerm extends Vue {
    @Prop({
        default: false
    })
    protected hoverMode: boolean

    protected active: boolean = false
    protected timo: any

    protected handleMouseOver() {
        if (this.hoverMode) {
            this.timo = setTimeout(() => {
                this.active = true
            }, 200)
        }
    }

    protected handleMouseLeave() {
        clearTimeout(this.timo)
        this.timo = setTimeout(() => {
            this.active = false
        }, 200)
    }
    protected handleBtnClick(e) {
        this.active = true
    }
}
</script>

<style lang="stylus">
.dropdown
  display inline-block
  position relative
  &.hover:hover, &.active
    .dropdown-list
      display inline-block
  .dropdown-btn
    display inline-block
  .dropdown-list
    z-index 1000
    display none
    background-color rgba(0, 0, 0, 0.95)
    color #cccccc
    border solid 1px rgba(255, 255, 255, 0.2)
    position absolute
    right 0
    padding 5px
    min-width 80px
    font-size 12px
    li
      padding 3px 10px
      white-space nowrap
      &>i.icon
        margin-right 5px
      &.line
        width 100%
        height 1px
        padding 0
        background-color rgba(255, 255, 255, 0.3)
        margin 5px 0
        overflow hidden
      &:hover
        background-color rgba(255, 255, 255, 0.3)
</style>
