<template>
  <section class="terminal-header"
           flex="main:justify">
    <ul class="t-h-left"
        flex>
      <div class="li-group"
           flex>
        <li :class="{active: columns === 1}"
            @click="handleAction('columns-change', 1)"><i class="col-1"></i></li>
        <li :class="{active: columns === 2}"
            @click="handleAction('columns-change', 2)"><i class="icon icon-col-2"></i></li>
        <li :class="{active: columns === 3}"
            @click="handleAction('columns-change', 3)"><i class="icon icon-col-3"></i></li>
      </div>
    </ul>
    <ul class="t-h-right"
        flex>
      <li @click="handleAction('add-terminal', {index:0})"><i class="icon icon-add"></i></li>
    </ul>

  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'

@Component({ components: {} })
export default class TerminalsHeader extends Vue {
    @State('columns') columns: number = 1
    mounted() {
        this.columns = motx.getState('columns')
    }

    protected handleAction(action, arg) {
        if (action === 'columns-change') {
            motx.setState('columns', arg)
            setTimeout(() => {
                motx.publish('terminal-fit')
            }, 100)
        } else {
            motx.publish(action, arg)
        }
    }
}
</script>

<style lang="stylus">
.terminal-header
  background-color rgba(0, 0, 0, 0.8)
  color #999
  ul
    .li-group
      font-size 12px
      color #666
      i
        position relative
        top 2px
        &.col-1
          top 3px
          border-color #666
    li
      padding 3px 6px
      width 30px
      cursor pointer
      text-align center
      &.active
        color #ccc
        .col-1
          border-color #ccc
      &:hover
        background-color rgba(255, 255, 255, 0.1)
  .col-1
    display inline-block
    border 1px solid rgba(255, 255, 255, 0.6)
    width 8px
    height 14px
    border-radius 3px
    vertical-align text-top
</style>
