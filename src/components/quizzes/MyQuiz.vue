<template>
  <div>
    <div class="text-indigo-light">
      <div class="text-red" v-if="error">{{ error }}</div>
      <h1 class="mb-5">MyQuiz</h1>
      <p>タイトル：「{{ quiz.title }}」</p>
      <p>本文：「{{ quiz.question }}」</p>
    </div>
    <ul>
      <li v-for="query in queries" :key="query.id">
        <p>
        カテゴリ:{{ query.category }}
        </p>
        <p>
        {{ query.body }} : {{ query.answer }} [ 獲得ポイント: {{ query.point }} ] [ 開示ポイント： {{ query.revealed_point }} ]
        </p>
      </li>
    </ul>
    <button @click.prevent="toggle()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">追加画面</button>
    <transition name="fade">
      <div v-show="open">
        <form @submit.prevent="addQuery(quiz.id)">
          <div class="m-6">
            <label for="query_category" class="label">カテゴリ</label>
            <select
              id="query_category"
              class="shadow-inner p-4 border-0 height-3"
              autofocus autocomplete="off"
              v-model.number="newQuery.category"
            >
            <option value="0">未分類</option>
            <option value="1">人物について</option>
            <option value="2">出来事について</option>
            <option value="3">時刻について</option>
            <option value="4">場所について</option>
            <option value="5">理由について</option>
            <option value="6">方法について</option>
            </select>
          </div>

          <div class="m-6">
            <label for="query_body" class="label">質問</label>
            <textarea
              id="query_body"
              class="w-full shadow-inner p-4 border-0"
              autofocus autocomplete="off"
              placeholder="男がウミガメのスープを食べたのは初めてでしたか？"
              v-model="newQuery.body"
            />
          </div>

          <div class="m-6">
            <label for="query_answer" class="label">回答</label>
            <textarea
              id="query_answer"
              class="w-full shadow-inner p-4 border-0"
              autofocus autocomplete="off"
              placeholder="いいえ。以前にもどこかで食べたことがありました。"
              v-model="newQuery.answer"
            />
          </div>

          <div class="m-6">
            <label for="query_point" class="label">獲得ポイント</label>
            <input
              id="query_point"
              class="shadow-inner p-4 border-0"
              autofocus autocomplete="off"
              placeholder="1"
              type="number"
              min="0"
              v-model.number="newQuery.point"
            /> pt ( 設定：この質問を行うと得られるポイント)
          </div>

          <div class="m-6">
            <label for="query_revealed_point" class="label">開示ポイント</label>
            <input
              id="query_revealed_point"
              class="shadow-inner p-4 border-0"
              autofocus autocomplete="off"
              placeholder="10"
              type="number"
              min="0"
              v-model.number="newQuery.revealedPoint"
            /> pt ( 設定：この質問を出現させるために必要なポイント)
          </div>
        <input type="submit" value="問題作成" class="width-font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block py-4 text-white items-center justify-center" />
        </form>
      </div>
    </transition>
    <div>
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyQuiz',
  data () {
    return {
      newQuery: {},
      queries: [],
      open: false,
      error: '',
      message: ''
    }
  },
  computed: {
    quiz: function () {
      return this.$store.getters.quiz
    },
    author: function () {
      return this.$store.getters.author
    }
  },
  created () {
    this.fetchQueries(this.quiz.id)
  },
  methods: {
    toggle () {
      this.open = !this.open
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    addQuery (quizId) {
      const value = this.newQuery
      if (!value) {
        return
      }
      this.$http.secured.post(`/api/v1/quizzes/${quizId}/queries`,
        { query: { category: this.newQuery.category,
          body: this.newQuery.body,
          answer: this.newQuery.answer,
          point: this.newQuery.point,
          revealed_point: this.newQuery.revealedPoint} })
        .then(response => {
          this.queries.push(response.data)
          this.newQuery = {}
          this.message = '質問を作成しました！'
          this.toggle()
        })
        .catch(error => this.setError(error, '質問の作成に失敗しました。'))
    },
    fetchQueries (quizId) {
      this.$http.secured.get(`/api/v1/quizzes/${quizId}/queries`)
        .then(response => {
          this.queries = response.data
        })
        .catch(error => {
          this.setError(error, '質問検索時エラー：　なにかがおかしいです。')
        })
    }
  }
}
</script>

<style scoped>
.title {
  color: red;
}

.fade-enter-active, .fade-leave-active {
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

</style>
