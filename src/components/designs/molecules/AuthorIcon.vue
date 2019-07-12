<template>
  <div @click="jumpToAuthor" class="flex items-center justify-start">
    <img class="w-8 h-8 rounded-full mr-4" :src="avatar">
    <div class="text-xs">
      <p class="text-black leading-none">{{ author.name }}</p>
      <p class="text-grey-dark">{{ created_date }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    avatar: String,
    author: Object,
    created_at: String,
    filterMethod: Function
  },
  data () {
    return {
      created_date: ''
    }
  },
  mounted () {
    this.created_date = this.filterMethod(this.created_at)
  },
  methods: {
    jumpToAuthor () {
      this.$router.push(`/users/${this.author.id}`)
    }
  }
}
</script>
