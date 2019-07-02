<template>
  <div>
    <h1 class="inline">{{ quiz.title }}</h1>
    <a href="#" @click.prevent="jumpToAuthor(quiz.user_id)" class="float-right inline-block mt-1 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-1 px-2 mr-2 rounded">作者：{{ author.name }} </a>
    <p class="mt-2">{{ quiz.question }}</p>
  </div>
</template>

<script>
export default {
  name: 'OthersQuiz',
  data () {
    return {
      queries: [],
      quiz_status: {},
      error: ''
    }
  },
  computed: {
    quiz: function () {
      return this.$store.getters.quiz
    },
    author: function () {
      return this.$store.getters.author
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    jumpToAuthor (userId) {
      this.$router.push(`/users/${userId}`)
    }
  }
}
</script>
