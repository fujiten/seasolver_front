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
      現在の質問数：０
      質問一覧：
      </p>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Quiz',
  data () {
    return {
      quiz: {},
      user: {},
      error: ''
    }
  },
  created () {
    const id = this.$route.params.id
    this.$http.secured.get(`/api/v1/quizzes/${id}`)
      .then(response => {
        this.quiz = response.data
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
