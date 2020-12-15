<template>
  <section class="xterm-header"
           flex="mian:justify box:mean">
    <div class="left">
      <div class="term-drag-handler hover-show">
        <i class="icon icon-drag"></i>
      </div>
      <div class="title"
           :class="{ border: firstClick }"
           @click="handleTitleClick"
           v-if="term.title && !editTitle">
        {{ term.title }}
      </div>
      <input ref="inputTitle"
             class="input-title"
             placeholder="Unnamed Terminal"
             type="text"
             v-model="title"
             @change="handleTitleChange"
             @blur="handleTitleBlur"
             v-else />
    </div>
    <div class="right"
         flex="main:right ">
      <template v-if="!editMode">
        <div class="term-btn  hover-show"
             title="Edit Script"
             @click="handleAddScript()">
          <i class="icon icon-add"></i>
        </div>

        <Dropdown :hoverMode="true"
                  key="cmds"
                  class="cmds"
                  v-if="term.cmds.length">
          <div class="term-btn hover-show"
               slot="btn"
               title="Exec Script">
            <i class="icon icon-play1"></i>
          </div>
          <template slot="list">
            <div class="cmd-item"
                 v-for="(item, i) in term.cmds">
              <div class="remove-btn"
                   @click="
                                    handleAction('delete-terminal-cmd', item.id)
                                ">
                <i class="icon icon-remove"></i>
              </div>
              <div class="edit-btn"
                   @click="handleAction('edit-script', item)">
                <i class="icon icon-edit"></i>
              </div>
              <div class="play-btn"
                   @click="handleAction('run-script', item.shell)">
                <i class="icon icon-play1"></i>{{ item.label }}
              </div>
            </div>
          </template>
        </Dropdown>
      </template>
      <template v-else>
        <div class="term-btn"
             @click="handleAction('save-script')">
          <i style="font-size: 16px;"
             class="icon icon-save"></i>
        </div>
      </template>
      <Dropdown :hoverMode="true"
                class="more-btn"
                key="btns">
        <div class="term-btn"
             slot="btn">
          <i class="icon icon-more"></i>
        </div>
        <template slot="list">
          <li class="pointer"
              @click="handleAction('copy-terminal')">
            <i style="font-size: 12px;"
               class="icon icon-copy"></i>
            Copy
          </li>
          <li class="line"></li>
          <li class="pointer"
              @click="handleAction('delete-terminal')">
            <i style="font-size: 13px;"
               class="icon icon-remove"></i>
            Delete
          </li>
        </template>
      </Dropdown>
    </div>
    <div class="shell-params"
         v-if="paramInputs.name"
         @click.stop="paramInputs.name=''">
      <div class="box"
           @click.stop>
        <div>按Enter完成输入</div>
        <input type="text"
               autofocus
               @keydown.esc="paramInputs.name=''"
               @keydown.enter="paramInputs.enter = true"
               v-model="paramInputs.value"
               :placeholder="paramInputs.name">
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import motx from '@/motx'
import Dropdown from '@/views/components/Dropdown.vue'
@Component({ components: { Dropdown } })
export default class XTerm extends Vue {
    @Prop({
        default: () => ({})
    })
    protected term: PlainObject

    @Prop({
        default: false
    })
    protected editMode: boolean

    protected title: string = ''
    protected editTitle: boolean = false
    protected firstClick: boolean = false
    protected timo: any
    protected interv: any

    @Watch('paramInputs.name') nameChange(val) {
        if (!val && this.interv) {
            clearInterval(this.interv)
            this.interv = 0
        }
    }

    protected paramInputs: { name: string; value: string; enter: boolean } = {
        name: '',
        value: '',
        enter: false
    }

    protected async handleAction(action, arg) {
        if (action === 'run-script') {
            console.log(action, arg)
            arg = await this.getParams(arg)
        }
        motx.publish(action, this.term.id, arg)
    }

    protected async getParams(arg: string) {
        if (!arg.match(/\$\{.*?\}/g)) {
            return arg
        }
        const params = arg
            .match(/\$\{.*?\}/g)
            .map((item) => item.replace(/\$\{/, '').replace(/\}/, ''))
            .reduce((res, item) => {
                if (res.includes(item)) return res
                else {
                    res.push(item)
                    return res
                }
            }, [])

        this.paramInputs.name = params.join(',')
        this.paramInputs.value = ''
        this.paramInputs.enter = false
        this.$nextTick(() => {})
        const res = await new Promise((r) => {
            this.interv = setInterval(() => {
                if (this.paramInputs.enter && this.paramInputs.value) {
                    clearInterval(this.interv)
                    this.interv = 0
                    r(
                        this.paramInputs.value
                            .split(',')
                            .reduce((res, item, i) => {
                                res[params[i]] = item
                                return res
                            }, {})
                    )
                    this.paramInputs.enter = false
                    this.paramInputs.name = ''
                    this.paramInputs.value = ''
                }
            }, 100)
        })

        return arg.replace(/\$\{.*?\}/g, (item, i) => {
            return res[item.replace(/\$\{/, '').replace(/\}/, '')]
        })
    }

    protected handleTitleClick() {
        if (this.timo) {
            clearTimeout(this.timo)
            this.timo = null
        }
        if (!this.firstClick) {
            this.firstClick = true
            this.timo = setTimeout(() => {
                this.firstClick = false
            }, 2000)
        } else {
            this.editTitle = true
            this.title = this.term.title
            this.$nextTick(() => {
                const el = this.$refs.inputTitle as HTMLInputElement
                el.focus()
                el.select()
            })
        }
    }

    protected handleAddScript() {
        motx.publish('add-terminal-cmd', this.term.id)
        setTimeout(() => {
            motx.publish(
                'edit-script',
                this.term.id,
                this.term.cmds[this.term.cmds.length - 1]
            )
        }, 100)
    }

    protected handleTitleBlur(e) {
        this.firstClick = false
        this.editTitle = false
    }

    protected handleTitleChange(e) {
        motx.publish('update-terminal', { id: this.term.id, title: this.title })
        this.firstClick = false
        this.editTitle = false
    }
}
</script>

<style lang="stylus">
.terminal-wrapper
  &.focus
    .xterm-wrapper
      .xterm-header
        opacity 1
  .xterm-header
    width 100%
    line-height 20px
    padding 0
    font-size 13px
    opacity 1
    user-select none
    .shell-params
      width 100%
      height 100%
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      background-color rgba(0, 0, 0, 0.4)
      .box
        position absolute
        left 50%
        top 50%
        transform translate(-50%, -50%)
        background-color rgba(255, 255, 255, 0.9)
        padding 10px
        color #666
        font-size 12px
        line-height 28px
        span
          color #333
        input
          width 160px
          height 30px
          line-height 30px
          padding 10px
          border solid 1px #ccc
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
        background-color rgba(255, 255, 255, 0.2)
        border none
        color #eee
        font-size 13px
        width calc(100% - 40px)
        height 100%
        padding 0 10px
        user-select auto
        &::placeholder
          color #999
      .title
        height 100%
        text-overflow ellipsis
        font-size 13px
        line-height 1
        padding 3px
        cursor text
        overflow hidden
        white-space nowrap
        border 1px solid rgba(255, 255, 255, 0)
        &.border
          border 1px solid rgba(255, 255, 255, 0.5)
    .right
      .more-btn
        font-size 12px
      .cmds
        background-color #000
        .dropdown-list
          max-height 235px
          overflow auto
          background-color #000
        .cmd-item
          width 170px
          &>div
            float left
            display inline-block
            height 24px
            line-height 24px
            padding 0 5px
            cursor pointer
            i.icon
              position relative
              top 1px
            &:hover
              background-color rgba(255, 255, 255, 0.2)
          .play-btn
            width 120px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
          .edit-btn
            width 25px
          .remove-btn
            width 25px
        i.icon
          font-size 13px
          margin-right 5px
      .dropdown
        &:hover
          .term-btn
            background-color rgba(255, 255, 255, 0.2)
      .term-btn
        padding 0 10px
        color #ccc
        transition background 0.2s
        cursor pointer
        i
          font-size 13px
        &:hover
          background-color rgba(255, 255, 255, 0.2)
</style>
