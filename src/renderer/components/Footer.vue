<template>
  <section class="fuck-footer">
    <input type="text"
           @keydown.enter="handleEnter"
           @input="handleInput"
           @blur="handleBlur">
  </section>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
@Component({ components: { CTips, CFooter, CXTerm } })
export default class App extends Vue {
  mounted() {}
  handleEnter(e) {
    this.$emit("enter", e.target.value);
  }
  handleInput(e) {
    this.$emit("input", e.target.value);
  }
  handleBlur(e) {
    this.$emit("blur", e.target.value);
  }
}
</script>

<style>
</style>
