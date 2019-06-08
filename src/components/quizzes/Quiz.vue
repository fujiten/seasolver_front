<template>
  <div>
    <div class="text-red" v-if="error">{{ error }}</div>
    <div>
      <p>タイトル：「{{ quiz.title }}」</p>
      <p>{{ quiz.question }}</p>
      <a href="#" @click.prevent="jumpToUser(quiz.user_id)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">作者：{{ user.name }} </a>
    </div>

    <div>
      <p>
      現在の質問数：{{ quiz_status.query_times}} , 現在のポイント： {{ quiz_status.total_points }}
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
      user: {},
      error: ''
    }
  },
  created () {
    const id = this.$route.params.id
    this.$http.secured.get(`/api/v1/quizzes/${id}`)
      .then(response => {
        this.quiz = response.data[0]
        this.queries = response.data[1]
        this.quiz_status = response.data[2]
        this.getUser(this.quiz.user_id)
      })
      .catch(error => this.setError(error, '問題検索時エラー：　なにかがおかしいです。'))
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    getUser (userId) {
      this.$http.secured.get(`/api/v1/users/${userId}`)
        .then(response => { this.user = response.data })
        .catch(error => this.setError(error, 'ユーザー検索時エラー：　なにかがおかしいです。'))
    },
    jumpToUser (userId) {
      this.$router.push(`/users/${userId}`)
    }
  }
}
</script>
