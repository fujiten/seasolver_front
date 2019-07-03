<template>
  <div class="max-w-md m-auto py-10 border-4 border-white">
    <h3 class="font-mono text-3xl mb-10 text-center">問題と解説のセットを仮作成</h3>
    <p class="text-center">まずは「問題」と「解説」のセットを作ろう。</p>
    <p class="text-center">作った問題に「質問」を追加していくのは、それからだ！</p>

    <div class="mt-6" v-if="error">
      <ul v-for="(err, index) in error" v-bind:key="index">
        <li class="text-red">{{ err }}</li>
      </ul>
    </div>

    <form @submit.prevent="addQuiz">
      <div class="mt-6 mb-6">
        <label for="quiz_title" class="label text-xl">タイトル</label><span> (20文字以内)</span>
        <input
          id="quiz_title"
          class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="例）ウミガメのスープ"
          v-model="newQuiz.title" />
      </div>

      <div class="mb-6">
        <label for="quiz_question" class="label text-xl">問題</label>
        <textarea
          id="quiz_question"
          class="h-32 mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="例）ウミガメのスープを食べた男は、そのあとすぐに海に飛び込んでしまった。どうしてだろう。"
          v-model="newQuiz.question"
        />
       </div>

      <div class="mb-6">
        <label for="quiz_answer" class="label text-xl">解説</label>
        <textarea
          id="quiz_answer"
          class="h-32 mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="例）あまりにもウミガメのスープがおいしくて、居ても経ってもいられなくなったから。"
          v-model="newQuiz.answer"
        />
      </div>

      <p>タイトル： {{ newQuiz.title }}</p>
      <p>問題： {{ newQuiz.question }}</p>
      <p class="mb-6">回答： {{ newQuiz.answer }}</p>

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
          this.newQuiz = ''
          const id = response.data.id
          this.$router.push(`/quizzes/${id}`)
        })
        .catch(error => this.setError(error, ['問題の作成に失敗しました。']))
    }
  }
}
</script>
