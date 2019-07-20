<template>
  <div class="container">
    <img class="mt-2 img w-full object-cover px-1" v-lazy="quiz.image">
    <div class>
      <div class="mt-16 flex items-center">
        <h1 class="inline text-3xl font-bold">{{ quiz.title }}</h1>
        <button v-if="isMyQuiz" @click="jumpTo(`/quizzes/${quiz.id}/myquiz`)" class="text-white ml-3 py-1 px-3 bg-grey-darker hover:bg-indigo-darker">編集</button>
      </div>
      <AuthorIcon v-bind="quiz" v-bind:filterMethod="toDate" class="mt-2" />
      <p class="mt-4 text-lg leading-normal">{{ quiz.question }}</p>
      <p class="mt-4">(難易度目安: {{ quiz.difficulity }})</p>
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
  computed: {
    isMyQuiz () {
      return parseInt(this.quiz.author.id) === parseInt(this.$store.getters.uid)
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    jumpTo (path) {
      this.$router.push(path)
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
  min-height: 500px;
}

@media (min-width: 576px) {
  .img {
  height: 18rem;
  object-fit: cover;
  }
}

@media (max-width: 576px) {
  .img {
  height: 14rem;
  object-fit: cover;
  }
}

</style>
