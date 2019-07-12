<template>
  <div class="container">
    <img class="img w-full px-1" src="https://v0.tailwindcss.com/img/card-left.jpg">
    <div class="px-2">
      <h1 class="mt-16 text-3xl font-bold">{{ quiz.title }}</h1>
      <AuthorIcon v-bind="quiz" v-bind:filterMethod="toDate" class="mt-2" />
      <p class="mt-4 text-lg">{{ quiz.question }}</p>
    </div>
  </div>
</template>

<script>
import AuthorIcon from '@/components/designs/molecules/AuthorIcon.vue'
export default {
  name: 'OthersQuiz',
  components: { AuthorIcon },
  props: {
    quiz: Object
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    jumpToAuthor (userId) {
      this.$router.push(`/users/${userId}`)
    },
    toDate (value) {
      const createdTime = value.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
      createdTime.shift()
      const [year, month, day, hours, minutes] = createdTime
      return `${year}/${month}/${day} ${hours}:${minutes}`
    }
  }
}
</script>

<style scoped>

.container {
  min-height: 700px;
}

@media (min-width: 576px) {
  .img {
  height: 18rem;
  }
}

@media (max-width: 576px) {
  .img {
  height: 14rem;
  }
}

</style>
