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
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchMyUserInfo () {
      this.$http.secured.get(`/api/v1/users/show_mypage`)
        .then(response => {
          this.user = response.data.current_user
          this.draftedQuizzes = response.data.my_quizzes.drafted
          this.publishedQuizzes = response.data.my_quizzes.published
        })
        .catch(error => {
          this.setError(error, 'ユーザー情報検索時エラー：　なにかがおかしいです。')
        })
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
