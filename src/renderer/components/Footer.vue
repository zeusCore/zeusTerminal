<template>
    <section class="fuck-footer">
        <input
            type="text"
            @keydown.enter="handleEnter"
            @input="handleInput"
            @blur="handleBlur"
        />
    </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import motx from '@/motx'
@Component({ components: {} })
export default class App extends Vue {
    mounted() {}
    handleEnter(e) {
        motx.publish('input-enter', e.target.value)
        e.target.value = ''
    }
    handleInput(e) {
        motx.publish('input-keydown', e.target.value)
    }
    handleBlur(e) {
        motx.publish('input-blur', e.target.value)
    }
}
</script>

<style></style>
