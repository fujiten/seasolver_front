<template>
  <div class="max-w-md m-auto py-10 border-4 border-white">
    <h3 class="font-mono text-3xl mb-10 text-center">問題編集</h3>

    <form @submit.prevent="patchQuiz">
      <div class="mt-6 mb-6">
        <label for="quiz_title" class="label text-xl">タイトル</label><span> (20文字以内)</span>
        <input
          id="quiz_title"
          class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="例）ウミガメのスープ"
          v-model="quiz.title" />
      </div>

      <div class="mb-6">
        <label for="quiz_question" class="label text-xl">問題</label>
        <textarea
          id="quiz_question"
          class="h-32 mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="例）ウミガメのスープを食べた男は、そのあとすぐに海に飛び込んでしまった。どうしてだろう。"
          v-model="quiz.question"
        />
       </div>

      <div class="mb-6">
        <label for="quiz_answer" class="label text-xl">解説</label>
        <textarea
          id="quiz_answer"
          class="h-32 mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="例）あまりにもウミガメのスープがおいしくて、居ても経ってもいられなくなったから。"
          v-model="quiz.answer"
        />
      </div>
      <hr class="border border-grey my-6" />
      <h3 class="text-center">プレビュー</h3>
      <hr class="border border-grey-light my-6" />
      <div class="quiz_container">
        <p v-show="quiz.title" class="font-serif font-semibold bmb-2 text-lg"> {{ quiz.title }} </p>
        <p v-show="quiz.question" class="my-1 text-sm">(問題)</p><p class="font-serif">{{ quiz.question }}</p>
        <p v-show="quiz.answer" class="my-1 text-sm">(解説)</p><p class="mb-6 font-serif">{{ quiz.answer }}</p>
      </div>
      <hr class="border border-grey my-6" />

    <div class="my-6" v-if="error">
      <ul v-for="(err, index) in error" v-bind:key="index">
        <li class="text-red">{{ err }}</li>
      </ul>
    </div>

      <div>{{ message }}</div>

      <input type="submit" value="問題編集" class="font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block w-full py-4 text-white items-center justify-center" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditQuiz',
  data () {
    return {
      quiz: {},
      error: '',
      message: ''
    }
  },
  created () {
    if (!localStorage.signedIn) {
      this.$router.replace('/')
    }
    this.fetchQuiz()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchQuiz () {
      this.$http.secured.get(`/api/v1/quizzes/${this.$route.params.id}`)
        .then(response => {
          this.quiz = response.data.quiz
        })
        .catch(error => {
          this.setError(error, '問題検索時エラー：　なにかがおかしいです。')
        })
    },
    patchQuiz () {
      const value = this.quiz
      if (!value) {
        return
      }
      const id = this.quiz.id
      this.$http.secured.patch(`/api/v1/quizzes/${id}`, { quiz: { title: this.quiz.title, question: this.quiz.question, answer: this.quiz.answer } })
        .then(response => {
          this.quiz = ''
          const id = response.data.id
          return this.$router.push({name: 'Quiz', params: { id: id, message: '問題を編集しました!' }})
        })
        .catch(error => this.setError(error, ['問題の作成に失敗しました。']))
    }
  }
}
</script>

<style scoped>

.quiz_container {
  white-space:pre-wrap;
  word-wrap:break-word;
}

</style>
