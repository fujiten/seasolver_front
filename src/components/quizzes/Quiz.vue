<template>
  <div>
    <div class="text-red" v-if="error">{{ error }}</div>

    <my-quiz v-if="isMine" />
    <others-quiz v-if="isOthers" />

    <div v-if="trying">
      <p>
      現在の質問数：{{ quiz_status.query_times }} , 現在のポイント： {{ quiz_status.total_points }}
      </p>
      <ul class="list-reset mt-4">
          <li class="py-4" v-for="(query, index) in queries" :key="query.id">
            <p>{{ index + 1 }} : {{ query.body }}</p>
          </li>
      </ul>
    </div>
  </div>

</template>

<script>
import MyQuiz from './MyQuiz.vue'
import OthersQuiz from './OthersQuiz.vue'
export default {
  name: 'Quiz',
  data () {
    return {
      quiz: {},
      queries: [],
      quiz_status: {},
      author: {},
      error: '',
      trying: false,
      isMine: false,
      isOthers: false
    }
  },
  components: {
    MyQuiz,
    OthersQuiz
  },
  created () {
    const quizId = this.$route.params.id
    this.$http.secured.get(`/api/v1/quizzes/${quizId}`)
      .then(response => {
        this.quiz = response.data.quiz
        this.author = response.data.author
        this.isMine = response.data.isMine
        this.isOthers = response.data.isOthers
        this.$store.dispatch('setQuiz', this.quiz)
        this.$store.dispatch('setAuthor', this.author)
      })
      .catch(error => this.setError(error, '問題検索時エラー： なにかがおかしいです。'))
  },
  beforeDestroy () {
    this.$store.dispatch('setQuiz', '')
    this.$store.dispatch('setAuthor', '')
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    solveQuiz (quizId) {
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
