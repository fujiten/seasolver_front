<template>
  <div>
    <p>タイトル：「{{ quiz.title }}」</p>
    <p>{{ quiz.question }}</p>
    <a href="#" @click.prevent="jumpToAuthor(quiz.user_id)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">作者：{{ author.name }} </a>
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
