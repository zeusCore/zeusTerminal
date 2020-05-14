<template>
    <section>
        <CXTerm />
        <CTips />
        <CFooter />
    </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import CTips from './components/Tips.vue'
import CFooter from './components/Footer.vue'
import CXTerm from './components/XTerm.vue'
import './style/base.styl'

@Component({ components: { CTips, CFooter, CXTerm } })
export default class App extends Vue {
    mounted() {}
}
</script>

<style></style>
