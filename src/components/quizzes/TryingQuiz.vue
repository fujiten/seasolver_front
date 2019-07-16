<template>
  <div id="tryingQuiz" class="pt-5">
    <p class="text-lg font-bold"><font-awesome-icon icon="jedi" class="mr-2" />[ 挑戦中 ]</p>
    <p class="mt-3">
    現在の質問数：{{ done_queries.length }}
    </p>
    <p class="mt-1">
      <font-awesome-icon v-tooltip="'現在のポイント'" icon="fist-raised" class="mr-1" />
      現在のポイント： {{ currentPoint }} pt
    </p>
    <p class=mt-1>
      誤答した回数： {{ quizStatus.failed_answer_times }}
    </p>
    <SelectChoice
      v-bind:choices="choices"
      @closeExceptMe="closeExceptChoices"
      @selectRightChoice="updateQuizStatustoSolved"
      @selectWrongChoice="incrementQuizStatusFailedAnswer"/>

    <hr class="border border-grey m-0" />
    <transition name="fade">
    <div v-show="!lastChoiceOpen">
      <div class="mt-3">
        <TabItem
          v-for="content in tabContentsList"
          v-bind="content" :key="content.id"
          v-model="currentId"/>
      </div>

      <div class="border-t border-black y-full">
        <section v-for="content in tabContentsList" :key="content.id">
          <QueryTabContent
            v-if="currentId === content.id"
            v-bind:queries="content.queries"
            v-bind:id="content.id"
            v-bind:doQuery="doQuery"
            v-bind:currentPoint="currentPoint"/>
        </section>
      </div>

    </div>
    </transition>
  </div>
</template>

<script>
import TabItem from '@/components/designs/organisms/TabItem.vue'
import QueryTabContent from '@/components/designs/organisms/QueryTabContent.vue'
import SelectChoice from '@/components/designs/organisms/SelectChoice.vue'
export default {
  props: {
    quizId: Number,
    quiz_status: Object,
    done_queries: Array
  },
  components: { TabItem, QueryTabContent, SelectChoice },
  data () {
    return {
      queries: [],
      choices: [],
      quizStatus: {},
      confirmedOpen: false,
      answerOpen: false,
      lastChoiceOpen: false,
      currentId: 1,
      tabContentsList: {
        remainedQueries: { id: 1, label: '残っている質問', queries: [] },
        doneQueries: { id: 2, label: '完了した質問', queries: [] }
      }
    }
  },
  created () {
    this.fetchQueries()
    this.fetchChoices()
    this.quizStatus = this.quiz_status
  },
  computed: {
    remainedQueries () {
      const doneQueriesIds = this.done_queries.map(q => q.id)
      const remaindQueries = this.queries.filter(query => {
        return !doneQueriesIds.includes(query.id)
      })
      return remaindQueries
    },
    currentPoint () {
      let sum = 0
      if (this.done_queries) {
        this.done_queries.forEach(query => {
          sum += query.point
        })
      }
      return sum
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    updateQuizStatus () {
      if (!this.isMine && this.tryingQuiz) {
        this.$http.secured.patch(`/api/v1/quizzes/${this.quizId}/update_quiz_status`,
          { quiz_status: { total_points: this.currentPoint,
            query_times: this.done_queries.length} })
          .then(response => {
            this.quizStatus = response.data
          })
          .catch(error => this.setError(error, 'エラー： クイズ状況の更新に失敗しました。'))
      }
    },
    doQuery (query) {
      this.$http.secured.post(`/api/v1/quizzes/${this.$route.params.id}/queries/${query.id}/do_query`, { query: { quiz_status_id: this.quiz_status.id } })
        .then(response => {
          this.tabContentsList.doneQueries.queries.unshift(query)

          const index = this.tabContentsList.remainedQueries.queries.indexOf(query)
          if (index >= 0) {
            this.tabContentsList.remainedQueries.queries.splice(index, 1)
          }

          this.quiz_status.query_times += 1
        })
        .catch(error => this.setError(error, 'エラー： 質問に失敗しました'))
    },
    fetchQueries () {
      this.$http.secured.get(`/api/v1/quizzes/${this.quizId}/queries`)
        .then(response => {
          this.queries = response.data
          this.tabContentsList.remainedQueries.queries = this.remainedQueries
          this.tabContentsList.doneQueries.queries = this.done_queries
          this.$nextTick(() => this.scrollView())
        })
        .catch(error => this.setError(error, '質問検索時エラー：　質問を取得できませんでした。'))
    },
    fetchChoices () {
      this.$http.secured.get(`/api/v1/quizzes/${this.quizId}/choices`)
        .then(response => {
          this.choices = response.data
        })
        .catch(error => {
          this.setError(error, '選択肢検索時エラー：　なにかがおかしいです。')
        })
    },
    updateQuizStatustoSolved () {
      this.$http.secured.patch(`/api/v1/quizzes/${this.quizId}/update_quiz_status`,
        { quiz_status: { be_solved: true } })
        .then(response => {
          this.quizStatus = response.data
          this.$emit('getSolved')
        })
        .catch(error => this.setError(error, 'エラー： クイズ状況の更新に失敗しました。'))
    },
    incrementQuizStatusFailedAnswer () {
      this.$http.secured.patch(`/api/v1/quizzes/${this.quizId}/update_quiz_status`,
        { quiz_status: { be_solved: false }, increment: true })
        .then(response => {
          this.quizStatus = response.data
          this.lastChoiceOpen = false
        })
        .catch(error => this.setError(error, 'エラー： クイズ状況の更新に失敗しました。'))
    },
    closeExceptChoices () {
      this.lastChoiceOpen = true
    },
    scrollView () {
      const element = document.getElementById('tryingQuiz')
      element.scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  }
}
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 2s, transform 2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

</style>
