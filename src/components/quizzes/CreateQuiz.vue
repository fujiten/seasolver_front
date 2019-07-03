<template>
  <div class="max-w-md m-auto py-10 border-4 border-white">
    <h3 class="font-mono text-3xl mb-10 text-center">問題と解説のセットを仮作成</h3>
    <p class="text-center">まずは「問題」と「解説」のセットを作ろう。</p>
    <p class="text-center">作った問題に「質問」を追加していくのは、それからだ！</p>

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
      <hr class="border border-grey my-6" />
      <h3 class="text-center">プレビュー</h3>
      <hr class="border border-grey-light my-6" />
      <div class="newquiz_container">
        <p v-show="newQuiz.title" class="font-serif font-semibold bmb-2 text-lg"> {{ newQuiz.title }} </p>
        <p v-show="newQuiz.question" class="my-1 text-sm">(問題)</p><p class="font-serif">{{ newQuiz.question }}</p>
        <p v-show="newQuiz.answer" class="my-1 text-sm">(解説)</p><p class="mb-6 font-serif">{{ newQuiz.answer }}</p>
      </div>
      <hr class="border border-grey my-6" />

    <div class="my-6" v-if="error">
      <ul v-for="(err, index) in error" v-bind:key="index">
        <li class="text-red">{{ err }}</li>
      </ul>
    </div>

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
          this.newQuiz = ''
          const id = response.data.id
          return this.$router.push({name: 'Quiz', params: { id: id, message: '問題と解説のセットを仮作成しました。質問を１０個以上追加すれば、問題を公開することができます。' }})
        })
        .catch(error => this.setError(error, ['問題の作成に失敗しました。']))
    }
  }
}
</script>

<style scoped>

.newquiz_container {
  white-space:pre-wrap;
  word-wrap:break-word;
}

</style>
