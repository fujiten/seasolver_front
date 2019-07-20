<template>
  <div class="p-3">
    <div v-if="!loading" class="max-w-md m-auto py-10">
      Loading...
    </div>

    <div v-if="loading" class="max-w-md m-auto py-10">
      <div class="text-red" v-if="error">{{ error }}</div>
      <div>{{ $route.params.message }}</div>
      <div>{{ message }}</div>

      <OthersQuiz v-bind:quiz="quiz" id="scrollPoint" />

      <transition name="fade">
      <div class="my-5" v-if="beSolved">
        <p class="text-lg font-bold leading-normal">解説： {{ quiz.answer }}</p>
        <p class="mt-2">(すでに正解済みの問題です。)</p>
      </div>

      <div v-if="!beSolved">

        <div v-if="!isTryingQuiz && !isMyQuiz">
          <a href="#" @click.prevent="solveQuiz(quiz.id)" class="inline-block mt-6 mb-3 bg-transparent text-sm hover:bg-indigo hover:text-white text-indigo border border-indigo no-underline font-bold py-2 px-4 mr-2 rounded">
            <font-awesome-icon icon="jedi" size="lg" class="mr-2" />問題に挑戦する
          </a>
        </div>

        <hr class="border border-grey" />

        <transition name="fade">
          <TryingQuiz v-if="isTryingQuiz"
            v-bind:quizId="quiz.id"
            v-bind:quiz_status="quiz_status"
            v-bind:done_queries="done_queries"
            @getSolved="getSolved"/>
        </transition>

      </div>
      </transition>
    </div>
  </div>
</template>

<script>
import MyQuiz from '@/components/quizzes/MyQuiz.vue'
import OthersQuiz from '@/components/quizzes/OthersQuiz.vue'
import TryingQuiz from '@/components/quizzes/TryingQuiz.vue'
export default {
  name: 'Quiz',
  components: {
    MyQuiz,
    OthersQuiz,
    TryingQuiz
  },
  data () {
    return {
      quiz: {},
      quiz_status: {},
      done_queries: [],
      author: {},
      error: '',
      message: '',
      isTryingQuiz: false,
      loading: false
    }
  },
  computed: {
    isMyQuiz () {
      return parseInt(this.quiz.author.id) === parseInt(this.$store.getters.uid)
    },
    isSignedIn () {
      return this.$store.getters.signedIn === 'true' || this.$store.getters.signedIn === true
    },
    isPublished () {
      return this.quiz.published === 'published'
    },
    beSolved () {
      if (this.quiz_status && this.quiz_status.be_solved) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.fetchQuiz()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchQuiz () {
      const quizId = this.$route.params.id
      this.$http.secured.get(`/api/v1/quizzes/${quizId}`)
        .then(response => {
          this.quiz = response.data.quiz

          if (!this.isMyQuiz && this.isSignedIn) {
            this.fetchQuizStatus()
          } else if (!this.isMyQuiz && !this.quiz.published) {
            this.$router.go(-1)
          } else {
            this.loading = true
          }
        })
        .catch(error => this.setError(error, '問題検索時エラー： なにかがおかしいです。'))
    },
    fetchQuizStatus () {
      const quizId = this.$route.params.id
      this.$http.secured.get(`/api/v1/quizzes/${quizId}/show_quiz_status`)
        .then(response => {
          this.quiz_status = response.data.quiz_status
          this.loading = true
          if (this.quiz_status) {
            this.done_queries = response.data.done_queries
            this.isTryingQuiz = true
          }
        })
        .catch(error => this.setError(error, '問題ステータス検索時エラー： なにかがおかしいです。'))
    },
    solveQuiz (quizId) {
      if (!localStorage.signedIn) {
        return this.$router.push({name: 'Signin', params: { error: '問題に挑戦するためにはログインが必要です。' }})
      }
      this.$http.secured.post(`/api/v1/quizzes/${quizId}/solve`)
        .then(response => {
          this.queries = response.data.queries
          this.quiz_status = response.data.quiz_status
          this.done_queries = []
          this.isTryingQuiz = true
        })
        .catch(error => this.setError(error, 'エラー： 問題に挑戦できません。'))
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
    getSolved () {
      this.quiz_status.be_solved = true
      this.scrollView('scrollPoint')
    },
    scrollView (point) {
      const element = document.getElementById(point)
      element.scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  }
}
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
