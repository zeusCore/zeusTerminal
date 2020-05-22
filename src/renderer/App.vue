<template>
    <section class="fuck-term-app" flex>
        <CXTerm />
        <CEditer />
    </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import CEditer from './components/Editor.vue'
import CXTerm from './components/XTerm.vue'
import 'flex.css'
import './style/base.styl'

@Component({ components: { CEditer, CXTerm } })
export default class App extends Vue {
    mounted() {}
}
</script>

<style></style>
