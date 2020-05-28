<template>
  <section class="term-body"
           flex>
    <div class="terminals"
         flex="dir:top box:mean">
      <CTerminal v-for="(item, index) in terminals"
                 :term="item"
                 :key="item.id" />
    </div>
    <CEditer />
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CEditer from '../Editor/Editor.vue'
import CTerminal from '../Terminal/Terminal.vue'
import { State } from 'motx/dist/motx-vue'
import motx from '@/motx'
@Component({ components: { CEditer, CTerminal } })
export default class Body extends Vue {
    @State('terminals') terminals: PlainObject[] = []
    mounted() {
        this.terminals = motx.getState('terminals')
    }
}
</script>

<style lang="stylus">
.term-body
  .terminals
    width calc(100% - 400px)
  .term-editor
    width 400px
</style>
