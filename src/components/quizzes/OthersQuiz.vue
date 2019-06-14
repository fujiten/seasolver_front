<template>
  <div>
    <p>タイトル：「{{ quiz.title }}」</p>
    <p>{{ quiz.question }}</p>
    <a href="#" @click.prevent="solveQuiz(quiz.id)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">挑戦する</a>
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
    solveQuiz (quizId) {
      if (!localStorage.signedIn) {
        return this.$router.push({name: 'Signin', params: { error: '問題に挑戦するためにはログインが必要です。' }})
      }
      this.$http.secured.post(`/api/v1/quizzes/${quizId}/solve`)
        .then(response => {
          this.queries = response.data.queries
          this.quiz_status = response.data.quiz_status
          this.trying = true
        })
        .catch(error => this.setError(error, 'エラー： 問題に挑戦できません。'))
    },
    jumpToAuthor (userId) {
      this.$router.push(`/users/${userId}`)
    }
  }
}
</script>
