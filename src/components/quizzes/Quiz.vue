<template>
  <div>
    <div class="text-red" v-if="error">{{ error }}</div>
    <div>{{ message }}</div>
    <div v-if="quiz_status.be_solved">すでに正解済みの問題です。</div>

    <my-quiz v-if="isMine" />
    <others-quiz v-if="isOthers" />

    <div v-if="!tryingQuiz && isOthers">
      <a href="#" @click.prevent="solveQuiz(quiz.id)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">挑戦する</a>
    </div>

    <div v-if="tryingQuiz">
      <p>問題に挑戦中です。</p>
      <p>
      現在の質問数：{{ done_queries.length }} , 現在のポイント： {{ currentPoint }} , 誤答した回数: {{ quiz_status.failed_answer_times }}
      </p>

      <ul class="list-reset mt-4">
        <p>完了した質問一覧</p>
        <li class="py-4" v-for="(done_query, index) in done_queries" :key="done_query.id">
          <p>{{ index + 1 }} : {{ done_query.body }}</p>
          <p>{{ index + 1 }} : {{ done_query.answer }}  (獲得ポイント: {{ done_query.point }}, 要開示ポイント: {{ done_query.revealed_point }})</p>
        </li>
      </ul>

      <ul class="list-reset mt-4">
        <p>残っている質問一覧</p>
        <li class="py-4" v-for="(query, index) in remainedQueries" :key="query.id">
          <p>{{ index + 1 }} : {{ query.body }}</p>
          <p>{{ index + 1 }} : {{ query.answer }}</p>
          <button  @click.prevent="doQuery(query)" class="inlien-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">質問する</button>
        </li>
      </ul>

      <a href="#" @click.prevent="toggleAnswer()" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">回答する</a>
      <div v-if="confirmedOpen">
        <p>複数の選択肢の中から正解を選んで下さい。誤った場合は、最終スコアの質問数が＋５されます。</p>
        <p>＜注意＞回答に挑戦するボタンを押したあとは、回答を終えるまで新たに質問することは出来ません！</p>
        <a href="#" @click.prevent="answerQuestion()" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">回答に挑戦する</a>
      </div>

      <ul v-if="answerOpen" class="mt-4">
        <p>選択肢一覧</p>
        <li v-for="choice in choices" :key="choice.id">
          <p>
          選択肢の本文:{{ choice.body }}
          <button href="#" @click.prevent="selectChoice(choice.id, choice.correctness)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">これを選ぶ</button>
          </p>
        </li>
      </ul>

    </div>
  </div>

</template>

<script>
import MyQuiz from './MyQuiz.vue'
import OthersQuiz from './OthersQuiz.vue'
export default {
  name: 'Quiz',
  data () {
    return {
      quiz: {},
      queries: [],
      quiz_status: {},
      done_queries: [],
      choices: [],
      author: {},
      error: '',
      isMine: false,
      isOthers: false,
      message: '',
      confirmedOpen: false,
      answerOpen: false
    }
  },
  computed: {
    tryingQuiz () {
      if (this.quiz_status !== undefined) {
        this.fetchQuery()
        return true
      } else {
        return false
      }
    },
    currentPoint () {
      let sum = 0
      this.done_queries.forEach(query => {
        sum += query.point
      })
      return sum
    },
    remainedQueries () {
      const doneQueriesIds = this.done_queries.map(q => q.id)
      const remaindQueries = this.queries.filter(query => {
        return !doneQueriesIds.includes(query.id)
      })
      return remaindQueries
    }
  },
  components: {
    MyQuiz,
    OthersQuiz
  },
  created () {
    const quizId = this.$route.params.id
    this.$http.secured.get(`/api/v1/quizzes/${quizId}`)
      .then(response => {
        this.quiz = response.data.quiz
        this.author = response.data.author
        this.quiz_status = response.data.quiz_status
        this.done_queries = response.data.done_queries
        this.isMine = response.data.isMine
        this.isOthers = response.data.isOthers
        this.$store.dispatch('setQuiz', this.quiz)
        this.$store.dispatch('setAuthor', this.author)
      })
      .catch(error => this.setError(error, '問題検索時エラー： なにかがおかしいです。'))
  },
  beforeDestroy () {
    this.$store.dispatch('setQuiz', '')
    this.$store.dispatch('setAuthor', '')
    this.updateQuizStatus()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    solveQuiz (quizId) {
      if (!localStorage.signedIn) {
        return this.$router.push({name: 'Signin', params: { error: '問題に挑戦するためにはログインが必要です。' }})
      }
      this.$http.secured.post(`/api/v1/quizzes/${quizId}/solve`)
        .then(response => {
          this.queries = response.data.queries
          this.quiz_status = response.data.quiz_status
          this.message = '問題に挑戦！'
        })
        .catch(error => this.setError(error, 'エラー： 問題に挑戦できません。'))
    },
    updateQuizStatus () {
      this.$http.secured.patch(`/api/v1/quizzes/${this.quiz.id}/update_quiz_status`,
        { quiz_status: { total_points: this.currentPoint,
          query_times: this.done_queries.length} })
        .then(response => {
          this.quiz_status = response.data
        })
        .catch(error => this.setError(error, 'エラー： クイズ状況の更新に失敗しました。'))
    },
    fetchQuery () {
      this.$http.secured.get(`/api/v1/quizzes/${this.$route.params.id}/queries`)
        .then(response => {
          this.queries = response.data
        })
        .catch(error => this.setError(error, '質問検索時エラー：　質問を取得できませんでした。'))
    },
    jumpToAuthor (userId) {
      this.$router.push(`/users/${userId}`)
    },
    doQuery (query) {
      this.done_queries.push(query)
      this.$http.secured.post(`/api/v1/quizzes/${this.$route.params.id}/queries/${query.id}/do_query`, { query: { quiz_status_id: this.quiz_status.id } })
        .then(response => {
          this.quiz_status.query_times += 1
        })
        .catch(error => this.setError(error, 'エラー： 質問に失敗しました'))
    },
    toggleAnswer () {
      this.confirmedOpen = !this.confirmedOpen
      this.fetchChoices(this.quiz.id)
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
    answerQuestion () {
      this.answerOpen = !this.answerOpen
    },
    updateQuizStatustoSolved () {
      this.$http.secured.patch(`/api/v1/quizzes/${this.quiz.id}/update_quiz_status`,
        { quiz_status: { be_solved: true } })
        .then(response => {
          this.quiz_status = response.data
        })
        .catch(error => this.setError(error, 'エラー： クイズ状況の更新に失敗しました。'))
    },
    incrementQuizStatusFailedAnswer () {
      this.$http.secured.patch(`/api/v1/quizzes/${this.quiz.id}/update_quiz_status`,
        { quiz_status: { be_solved: true }, increment: true })
        .then(response => {
          this.quiz_status = response.data
        })
        .catch(error => this.setError(error, 'エラー： クイズ状況の更新に失敗しました。'))
    },

    selectChoice (choiceId, correctness) {
      if (correctness) {
        this.updateQuizStatustoSolved()
        this.message = 'おめでとう！ 正解だよ'
      } else {
        this.incrementQuizStatusFailedAnswer()
        this.message = 'やってしまいましたね。間違いです。'
      }
    }
  }
}
</script>
