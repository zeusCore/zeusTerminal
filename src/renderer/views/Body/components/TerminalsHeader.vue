<template>
    <section class="terminal-header" flex="main:justify">
        <ul class="t-h-left" flex>
            <div class="li-group" flex>
                <li
                    :class="{ active: columns === 1 }"
                    @click="handleAction('columns-change', 1)"
                >
                    <i class="col-1"></i>
                </li>
                <li
                    :class="{ active: columns === 2 }"
                    @click="handleAction('columns-change', 2)"
                >
                    <i class="icon icon-col-2"></i>
                </li>
                <li
                    :class="{ active: columns === 3 }"
                    @click="handleAction('columns-change', 3)"
                >
                    <i class="icon icon-col-3"></i>
                </li>
            </div>
            <li class="remote-setting" @click="listenRemote">
                <i class="icon icon-in"></i>
            </li>
            <Dropdown class="dropdown-standby-list">
                <li slot="btn" class="controls" @click="getStandbyList">
                    <i class="icon icon-out"></i>
                </li>
                <template slot="list">
                    <div
                        v-for="(item, index) in standbyList"
                        :key="item.id"
                        class="item pointer"
                        @click="controlRemote(item)"
                    >
                        {{ item.name }}
                    </div>
                </template>
            </Dropdown>
        </ul>
        <ul class="t-h-right" flex>
            <li @click="handleAction('push-terminal', { index: 0 })">
                <i class="icon icon-add"></i>
            </li>
            <li
                class="script-show-btn"
                :class="{ show: scriptShow }"
                @click="
                    ;(scriptShow = !scriptShow),
                        handleAction('toggle-script', scriptShow)
                "
            >
                <i class="icon icon-script"></i>
            </li>
        </ul>
    </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import motx from '@/motx'
import { State } from 'motx/dist/motx-vue'
import API from '@/api'
import Dropdown from '@/views/components/Dropdown.vue'
import ControlRemote from '@/lib/ControlRemote'
import RemoteControl from '@/lib/RemoteControl'

@Component({ components: { Dropdown } })
export default class TerminalsHeader extends Vue {
    @State('columns') columns: number = 1

    protected scriptShow: boolean = false
    protected standbyList: PlainObject[] = []
    protected cnnid: string = ''

    mounted() {
        this.columns = motx.getState('columns')
    }

    protected listenRemote() {
        RemoteControl.listen()
    }

    protected controlRemote(details) {
        ControlRemote.connect(details)
    }

    protected async getStandbyList() {
        localStorage.token = 'master'
        localStorage.timespan = '123'
        const { data } = await API.remote.standbyList()
        this.standbyList = data || []
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
  background-color rgba(255, 255, 255, 0.1)
  color #999
  padding 3px 0
  user-select none
  .dropdown-standby-list
    .dropdown-list
      right auto
      left -100px
      .item
        width 200px
  ul
    .li-group
      font-size 12px
      color #666
      margin 2px 0
      padding 0 15px
      border-right solid 1px rgba(255, 255, 255, 0.2)
      li
        padding 1px 3px
        width 24px
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
      transition all 0.2s
      &.active
        color #ccc
        .col-1
          border-color #ccc
      &:hover
        background-color rgba(255, 255, 255, 0.2)
      &.script-show-btn
        &.show
          background-color rgba(255, 255, 255, 0.3)
          padding-right 100px
      &.remote-setting, &.controls
        padding 0px 6px
        &:hover, .actice
          i
            color #fff
        i
          font-size 19px
      &.remote-setting
        margin-left 10px
  .col-1
    display inline-block
    border 1px solid rgba(255, 255, 255, 0.6)
    width 13px
    height 12px
    border-radius 3px
</style>
