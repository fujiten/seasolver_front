<template>
  <div>
    <div class="text-red" v-if="error">{{ error }}</div>
    <div>
      <p>タイトル：「{{ quiz.title }}」</p>
      <p>{{ quiz.question }}</p>
      <a href="#" @click.prevent="toSolve(quiz.id)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">挑戦する</a>
      <a href="#" @click.prevent="jumpToAuthor(quiz.user_id)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">作者：{{ author.name }} </a>
    </div>

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
export default {
  name: 'Quiz',
  data () {
    return {
      quiz: {},
      queries: [],
      quiz_status: {},
      author: {},
      error: '',
      trying: false
    }
  },
  created () {
    const quizId = this.$route.params.id
    this.$http.secured.get(`/api/v1/quizzes/${quizId}`)
      .then(response => {
        this.quiz = response.data[0]
        this.author = response.data[1]
      })
      .catch(error => this.setError(error, '問題検索時エラー： なにかがおかしいです。'))
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    toSolve (quizId) {
      this.$http.secured.post(`/api/v1/quizzes/${quizId}/solve`)
        .then(response => {
          this.queries = response.data[0]
          this.quiz_status = response.data[1]
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
