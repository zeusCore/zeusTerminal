

<template>
  <TitleBar :theme="theme"
            :platform="platform"
            :on-close="close"
            :on-maximize="toggleMaximize"
            :on-minimize="minimize"
            :is-maximizable="isMaximizable"
            :is-closable="isClosable"
            :is-minimizable="isMinimizable"
            :show-icon="showIcon"
            :show-title="showTitle">

    <template slot="icon">
      <i class="icon icon-term"></i>
    </template>

    <template slot="title">
      Zeus Terminal
    </template>
  </TitleBar>
</template>
<script>
import { remote } from 'electron'
import TitleBar from './TitleBar.vue'
import motx from '@/motx'

export default {
    components: { TitleBar },
    data() {
        return {
            platform: process.platform,
            theme: 'dark',
            isMaximizable: true,
            isMinimizable: true,
            isClosable: true,
            showTitle: true,
            showIcon: true
        }
    },
    methods: {
        close() {
            motx.pipe('main').publish('window-close', { target: 'index' })
        },
        toggleMaximize() {
            motx.pipe('main').publish('window-max', { target: 'index' })
        },
        minimize() {
            motx.pipe('main').publish('window-min', { target: 'index' })
        }
    }
}
</script>

<style lang="stylus"></style>