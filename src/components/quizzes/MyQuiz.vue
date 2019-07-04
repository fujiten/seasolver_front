<template>
  <div>
    <div class>
      <div>{{ message }}</div>
      <div class="text-red" v-if="error">{{ error }}</div>
      <h1 class="font-bold text-lg mb-5">MyQuiz ({{ isPublished }})</h1>
      <p>タイトル：「{{ quiz.title }}」</p>
      <p>本文：「{{ quiz.question }}」</p>
    </div>
    <ul>
      <p class="mt-3">質問一覧</p>
      <li v-for="query in queries" :key="query.id">
        <p>
        カテゴリ:{{ query.category }}
        </p>
        <p>
        {{ query.body }} : {{ query.answer }} [ 獲得ポイント: {{ query.point }} ] [ 開示ポイント： {{ query.revealed_point }} ]
        </p>
        <button href="#" @click.prevent="jumpToQuery(query.id)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">編集</button>
      </li>
    </ul>
    <ul class="mt-4">
      <p>選択肢一覧</p>
      <li v-for="choice in choices" :key="choice.id">
        <p>
        選択肢の本文:{{ choice.body }}, {{ choice.correctness }}
        </p>
      </li>
    </ul>
    <button @click.prevent="toggleQuery()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">質問追加画面</button>
    <transition name="fade">
      <div v-show="queryOpen">
        <form @submit.prevent="addQuery(quiz.id)">
          <div class="mt-6 mb-3">
            <label for="query_category" class="label">カテゴリ</label>
            <select
              id="query_category"
              class="mt-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

          <div class="my-3">
            <label for="query_body" class="label">質問</label>
            <textarea
              id="query_body"
              class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              autofocus autocomplete="off"
              placeholder="男がウミガメのスープを食べたのは初めてでしたか？"
              v-model="newQuery.body"
            />
          </div>

          <div class="my-3">
            <label for="query_answer" class="label">回答</label>
            <textarea
              id="query_answer"
              class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              autofocus autocomplete="off"
              placeholder="いいえ。以前にもどこかで食べたことがありました。"
              v-model="newQuery.answer"
            />
          </div>

          <div class="my-3">
            <label for="query_point" class="label">獲得ポイント</label>
            <input
              id="query_point"
              class="my-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              autofocus autocomplete="off"
              placeholder="1"
              type="number"
              min="0"
              v-model.number="newQuery.point"
            /> pt
            <p>( 設定：この質問を行うと得られるポイント)</p>
          </div>

          <div class="my-3">
            <label for="query_revealed_point" class="label">開示ポイント</label>
            <input
              id="query_revealed_point"
              class="my-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              autofocus autocomplete="off"
              placeholder="10"
              type="number"
              min="0"
              v-model.number="newQuery.revealedPoint"
            /> pt
            <p>( 設定：この質問を出現させるために必要なポイント)</p>
          </div>
        <input type="submit" value="問題作成" class="mt-5 width-font-sans font-bold px-4 py-2 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block text-white items-center justify-center" />
        </form>
      </div>
    </transition>

    <button @click.prevent="toggleChoice()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">回答の選択肢追加画面</button>
    <transition name="fade">
      <div v-show="choiceOpen">
        <form @submit.prevent="addChoice(quiz.id)">

          <div class="m-6">
            <label for="choice_body" class="label">選択肢</label>
            <textarea
              id="choice_body"
              class="w-full shadow-inner p-4 border-0"
              autofocus autocomplete="off"
              placeholder="ウミガメのスープが美味しすぎて、海に飛び込んでしまったのです。"
              v-model="newChoice.body"
            />
          </div>

          <div class="m-6">
            <input
              type="radio"
              id="choice_correctness_true"
              value=true
              v-model="newChoice.correctness"
            />
            <label for="choice_correctness_true" class="label">正解</label>

            <input
              type="radio"
              id="choice_correctness_false"
              value=false
              v-model="newChoice.correctness"
            />
            <label for="choice_correctness_true" class="label">不正解</label>
          </div>

        <input type="submit" value="選択肢作成" class="width-font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block py-4 text-white items-center justify-center" />
        </form>
      </div>
    </transition>

    <div>
      <button v-if="moreMinimumQuery" @click.prevent="publishQuestion()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">問題を公開する</button>
      <button v-if="moreMinimumQuery" @click.prevent="draftQuestion()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">問題を下書きにする</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyQuiz',
  data () {
    return {
      newQuery: {},
      newChoice: {},
      queries: [],
      choices: [],
      queryOpen: false,
      choiceOpen: false,
      error: '',
      message: '',
      quiz: this.$store.getters.quiz,
      author: this.$store.getters.author,
      open: true
    }
  },
  computed: {
    moreMinimumQuery () {
      if (this.queries.length > 9) {
        return true
      } else {
        return false
      }
    },
    isPublished () {
      if (this.quiz.published === 'drafted') {
        return '下書き'
      } else {
        return '投稿済'
      }
    }
  },
  created () {
    this.fetchQueries(this.quiz.id)
    this.fetchChoices(this.quiz.id)
  },
  methods: {
    resetMessages () {
      this.error = ''
      this.message = ''
    },
    toggleQuery () {
      if (!this.queryOpen) {
        this.resetMessages()
      }
      this.queryOpen = !this.queryOpen
    },
    toggleChoice () {
      if (!this.choiceOpen) {
        this.resetMessages()
      }
      this.choiceOpen = !this.choiceOpen
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
          this.toggleQuery()
        })
        .catch(error => this.setError(error, '質問の作成に失敗しました。'))
    },
    addChoice (quizId) {
      const value = this.newChoice
      if (!value) {
        return
      }
      this.$http.secured.post(`/api/v1/quizzes/${quizId}/choices`,
        { choice: {
          body: this.newChoice.body,
          correctness: this.newChoice.correctness } })
        .then(response => {
          this.choices.push(response.data)
          this.newChoice = {}
          this.message = '選択肢を作成しました！'
          this.toggleChoice()
        })
        .catch(error => this.setError(error, '選択肢の作成に失敗しました。'))
    },
    fetchQueries (quizId) {
      this.$http.secured.get(`/api/v1/quizzes/${quizId}/queries`)
        .then(response => {
          this.queries = response.data
        })
        .catch(error => {
          this.setError(error, '質問検索時エラー：　なにかがおかしいです。')
        })
    },
    fetchChoices (quizId) {
      this.$http.secured.get(`/api/v1/quizzes/${quizId}/choices`)
        .then(response => {
          this.choices = response.data
        })
        .catch(error => {
          this.setError(error, '選択肢検索時エラー：　なにかがおかしいです。')
        })
    },
    publishQuestion () {
      this.$http.secured.patch(`/api/v1/quizzes/${this.$route.params.id}`, { quiz: { published: 'published' } })
        .then(response => {
          this.quiz = response.data
          this.message = '問題を公開しました'
          this.error = ''
        })
        .catch(error => {
          this.setError(error, '問題公開時エラー：　なにかがおかしいです。')
        })
    },
    draftQuestion () {
      this.$http.secured.patch(`/api/v1/quizzes/${this.$route.params.id}`, { quiz: { published: 'drafted' } })
        .then(response => {
          this.quiz = response.data
          this.message = '問題を下書きに変更しました'
          this.error = ''
        })
        .catch(error => {
          this.setError(error, '下書き変更時エラー：　なにかがおかしいです。')
        })
    },
    jumpToQuery (queryId) {
      this.$router.push(`/queries/${queryId}/edit`)
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
