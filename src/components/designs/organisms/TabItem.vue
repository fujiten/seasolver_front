<template>
  <button @click="$emit('input', id)" :class="[active, 'tab']">
    {{ label }}
  </button>
</template>

<script>
export default {
  props: {
    id: Number,
    label: String,
    value: Number
  },
  computed: {
    active () {
      // このvalueはinput要素の中身（つまり親のv-model="currentId"と同値である）
      return this.value === this.id ? 'active' : false
    }
  }
}
</script>

<style scoped>
.tab {
  border-radius: 2px 2px 0 0;
  background: rgb(227, 222, 222);
  color: #311d0a;
  line-height: 24px;
  padding: 7px;
  margin-right: 1px;
  width: 120px;
  font-size: 15px;
  outline: none;
}
.tab:hover {
  background: #aba6a6;
}
.active {
  background: #f7c9c9;
}
</style>
