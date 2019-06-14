<template>
  <div class="max-w-md m-auto py-10 border-4 border-white">
    <div class="text-red" v-if="error">{{ error }}</div>
    <h3 class="font-mono text-3xl text-indigo-lightest mb-4 ml-4">問題作成</h3>

    <form @submit.prevent="addQuiz">
      <div class="mb-6">
        <label for="quiz_title" class="label">タイトル</label>
        <input
          id="quiz_title"
          class="input w-full"
          autofocus autocomplete="off"
          placeholder="タイトル 例：「ウミガメのスープ」"
          v-model="newQuiz.title" />
      </div>

      <div class="mb-6">
        <label for="quiz_question" class="label">問題文</label>
        <textarea
          id="quiz_question"
          class="w-full shadow-inner p-4 border-0"
          autofocus autocomplete="off"
          placeholder="ウミガメのスープを食べた男は、そのあとすぐに海に飛び込んでしまった。どうしてだろう。"
          v-model="newQuiz.question"
        />
       </div>

      <div class="mb-6">
        <label for="quiz_answer" class="label">回答</label>
        <textarea
          id="quiz_answer"
          class="w-full shadow-inner p-4 border-0"
          autofocus autocomplete="off"
          placeholder="あまりにもウミガメのスープがおいしくて、居ても経ってもいられなくなったから。"
          v-model="newQuiz.answer"
        />
      </div>

      <p>タイトル： {{ newQuiz.title }}</p>
      <p>問題： {{ newQuiz.question }}</p>
      <p>回答： {{ newQuiz.answer }}</p>
      <div class="w-full shadow-inner p-4 border-0 text-indigo-lightest">{{ newQuiz }}</div>

      <div>{{ message }}</div>

      <input type="submit" value="問題作成" class="font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block w-full py-4 text-white items-center justify-center" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateQuiz',
  data () {
    return {
      newQuiz: {},
      error: '',
      message: ''
    }
  },
  created () {
    if (!localStorage.signedIn) {
      this.$router.replace('/')
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    addQuiz () {
      const value = this.newQuiz
      if (!value) {
        return
      }
      this.$http.secured.post('/api/v1/quizzes', { quiz: { title: this.newQuiz.title, question: this.newQuiz.question, answer: this.newQuiz.answer } })
        .then(response => {
          this.message = '問題と回答のセットを保存しました。１０つ以上の「質問」を作成すれば、問題を公開することができます。'
        })
        .catch(error => this.setError(error, '問題の作成に失敗しました。'))
    }
  }
}
</script>
