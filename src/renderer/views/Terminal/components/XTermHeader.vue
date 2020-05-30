<template>

  <section class="xterm-header"
           flex="mian:justify box:mean">
    <div class="left">
      <div class="term-drag-handler hover-show"><i class="icon icon-drag"></i></div>
      <div class="title"
           :class="{border: firstClick}"
           @click="handleTitleClick"
           v-if="term.title && !editTitle">{{term.title}}</div>
      <input ref="inputTitle"
             class="input-title"
             placeholder="Unnamed"
             type="text"
             v-model="title"
             @change="handleTitleChange"
             @blur="handleTitleBlur"
             v-else />
    </div>
    <div class="right"
         flex="main:right ">
      <template v-if="!editMode">
        <div class="term-btn hover-show"
             title="Exec Script"
             v-if="!!term.cmds.trim()"
             @click="handleAction('run-script')"><i class="icon icon-play1"></i></div>
        <div class="term-btn  hover-show"
             title="Edit Script"
             @click="handleAction('edit-script')"><i class="icon icon-edit"></i></div>

      </template>
      <template v-else>
        <div class="term-btn"
             @click="handleAction('save-script')"><i style="font-size: 16px;"
             class="icon icon-save"></i></div>
      </template>
      <div class="term-btn">
        <Dropdown>
          <i class="icon icon-more"
             slot="btn"></i>
          <template slot="list">
            <li @click="handleAction('delete-terminal')"><i class="icon icon-remove"></i> Delete</li>
          </template>
        </Dropdown>
      </div>
    </div>
  </section>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
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

    protected handleAction(action) {
        motx.publish(action, this.term.id)
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
        background-color rgba(0, 0, 0, 1)
  .xterm-header
    width 100%
    line-height 20px
    padding 0
    font-size 13px
    background-color rgba(0, 0, 0, 1)
    opacity 1
    user-select none
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
