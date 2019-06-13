<template>
  <div>
    <div class="text-red" v-if="error">{{ error }}</div>
    <div>
      <p class="font-bold">マイページへようこそ！</p>
      <p>ユーザー名：「{{ user.name }}」</p>
      <p>ユーザーレベル：{{ user.level }}</p>
      <p>作った問題一覧：準備中...</p>
    </div>

    <div class="mt-5">
      <p>問題の下書き一覧</p>
      <ul>
        <li class="py-4" v-for="draftedQuiz in draftedQuizzes" :key="draftedQuiz.id">
          {{ draftedQuiz.title }}
          <a href="#" @click.prevent="jumpToQuiz(draftedQuiz.id)" class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">詳細</a>
        </li>
      </ul>
      <p>自分が公開した問題一覧</p>
      <ul>
        <li class="py-4" v-for="publishedQuiz in publishedQuizzes" :key="publishedQuiz.id">
          {{ publishedQuiz.title }}
          <a href="#" @click.prevent="jumpToQuiz(publishedQuiz.id)" class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">詳細</a>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Mypage',
  data () {
    return {
      user: {},
      error: '',
      draftedQuizzes: {},
      publishedQuizzes: {}
    }
  },
  created () {
    this.checkSignedIn()
    this.fetchMyUserInfo()
    this.fetchMyQuizzes()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    refreshToken () {
      this.$http.secured.post(`/refresh`)
        .then(response => { this.$router.replace('/mypage') })
        .catch(error => { this.setError(error, 'トークンのリフレッシュに失敗しました。一度ログアウトしてから再度ログインしてください。') })
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchMyUserInfo () {
      this.$http.secured.get(`/api/v1/users/show_mypage`)
        .then(response => {
          this.user = response.data
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.refreshToken()
          } else {
            this.setError(error, 'ユーザー検索時エラー：　なにかがおかしいです。')
          }
        })
    },
    fetchMyQuizzes () {
      this.$http.secured.get(`/api/v1/quizzes/show_my_quizzes`)
        .then(response => {
          this.draftedQuizzes = response.data.drafted
          this.publishedQuizzes = response.data.published
        })
        .catch(error => this.setError(error, '問題検索時エラー：　なにかがおかしいです。'))
    },
    jumpToQuiz (quizId) {
      this.$router.push(`quizzes/${quizId}`)
    },
    checkSignedIn () {
      if (!localStorage.signedIn) {
        this.$router.replace('/')
      }
    }
  }
}
</script>
