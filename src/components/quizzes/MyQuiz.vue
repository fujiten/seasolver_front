<template>
  <div class="max-w-md m-auto py-10 border-4 border-white">
    <div>
      <div>{{ message }}</div>
      <div class="text-red" v-if="error">{{ error }}</div>
      <h1 class="font-bold text-lg mb-5">{{ quiz.title }} ({{ isPublished }})</h1>
      <p>本文：「{{ quiz.question }}」</p>
      <p>解説：「{{ quiz.answer }}」</p>
      <div class="flex justify-end">
        <button @click.prevent="jumpToEditQuiz(quiz.id)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded"><font-awesome-icon icon="edit" /> 編集</button>
        <button @click.prevent="showDeleteDialog(quiz.id, deleteQuiz)" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-red hover:text-white text-red border border-red no-underline font-bold py-2 px-4 mr-2 rounded"><font-awesome-icon icon="trash-alt" /> 削除</button>
        <v-dialog/>

      </div>
    </div>
    <hr class="border border-grey" />
    <ul>
      <div class="mt-5">{{ queryMessage }}</div>
      <p class="mt-5 font-bold text-lg text-center">質問一覧</p>
      <div class="mt-4 p-3 border border-grey" v-for="query in queries" :key="query.id">
        <li>
          <p class="inline-block font-bold text-lg">Q.{{ query.body }}</p>
          <p class="mt-2 font-bold text-lg"> A.{{ query.answer }}</p>
          <p class="mt-2">カテゴリ:{{ query.category | categoryToJapanese  }}</p>
          <p> (獲得ポイント：{{ query.point }}) (開示ポイント：{{ query.revealed_point }})</p>
          <div class="flex justify-end">
            <button v-tooltip="'編集'" @click.prevent="jumpToQuery(query.id)" class="m-2"><font-awesome-icon icon="edit" /></button>
            <button v-tooltip="'削除'" @click.prevent="showDeleteDialog(query.id, deleteQuery)" class="m-2"><font-awesome-icon icon="trash-alt" /></button>
          </div>
        </li>
      </div>
    </ul>
    <div class="flex justify-center">
      <button @click.prevent="toggleQuery()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">質問追加</button>
    </div>

    <transition name="fade">
      <div v-show="queryOpen" class="p-2">
        <form @submit.prevent="addQuery(quiz.id)">
          <div class="mt-3 mb-3">
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
              placeholder="0"
              type="number"
              min="0"
              v-model.number="newQuery.revealedPoint"
            /> pt
            <p>( 設定：この質問を出現させるために必要なポイント)</p>
          </div>
        <div class="flex justify-center">
          <input type="submit" value="質問追加" class="mt-5 width-font-sans font-bold px-4 py-2 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block text-white" />
        </div>
        </form>
      </div>
    </transition>
    <div class="my-6" v-if="queryError">
      <ul v-for="(err, index) in queryError" v-bind:key="index">
        <li class="text-red">{{ err }}</li>
      </ul>
    </div>

    <hr class="border border-grey mt-5" />
    <div>
      <ul class="mt-4">
        <p class="mt-5 font-bold text-lg text-center">選択肢一覧</p>
        <div class="mt-5">{{ choiceMessage }}</div>
        <div  v-for="choice in choices" :key="choice.id" class="mt-4 p-3 border border-grey">
          <li>
            <p> 選択肢: {{ choice.body }}</p>
            <p class="mt-2">({{ choice.correctness | booleanToJapanese }})</p>
            <div class="flex justify-end" data-original-title="返信">
              <button v-tooltip="'編集'" @click.prevent="toggleEditChoice(choice.id)" class="m-2"><font-awesome-icon icon="edit" /></button>
              <button v-tooltip="'削除'" @click.prevent="showDeleteDialog(choice.id, deleteChoice)" class="m-2"><font-awesome-icon icon="trash-alt" /></button>
            </div>
            <transition name="fade">
              <div v-if="editChoiceOpen">
                <div v-show="choiceEditOpened(choice)">
                  <form @submit.prevent="patchChoice(choice.id)">

                    <div class="m-3">
                      <label for="choice_body" class="label">選択肢</label>
                      <textarea
                        id="choice_body"
                        class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        autofocus autocomplete="off"
                        placeholder="ウミガメのスープが美味しすぎて、海に飛び込んでしまったのです。"
                        v-model="choice.body"
                      />
                    </div>

                    <div class="m-3">
                      <input
                        type="radio"
                        id="choice_correctness_true"
                        value=true
                        v-model="choice.correctness"
                      />
                      <label for="choice_correctness_true" class="label">正解の選択肢にする</label>

                      <input
                        type="radio"
                        id="choice_correctness_false"
                        value=false
                        v-model="choice.correctness"
                      />
                      <label for="choice_correctness_false" class="label">不正解の選択肢にする</label>
                    </div>

                  <input type="submit" value="選択肢編集" class="m-2 width-font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block py-2 text-white items-center justify-center" />
                  </form>
                </div>
              </div>
            </transition>
          </li>
        </div>
      </ul>
    </div>
    <div class="flex justify-center">
      <button @click.prevent="toggleChoice()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">選択肢追加</button>
    </div>
    <transition name="fade">
      <div v-show="choiceOpen" class="p-2">
        <form @submit.prevent="addChoice(quiz.id)">

          <div class="m-3">
            <label for="choice_body" class="label">選択肢</label>
            <textarea
              id="choice_body"
              class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              autofocus autocomplete="off"
              placeholder="ウミガメのスープが美味しすぎて、海に飛び込んでしまったのです。"
              v-model="newChoice.body"
            />
          </div>

          <div class="m-3">
            <input
              type="radio"
              id="choice_correctness_true"
              value=true
              v-model="newChoice.correctness"
            />
            <label for="choice_correctness_true" class="label">正解の選択肢にする</label>

            <input
              type="radio"
              id="choice_correctness_false"
              value=false
              v-model="newChoice.correctness"
            />
            <label for="choice_correctness_false" class="label">不正解の選択肢にする</label>
          </div>

        <input type="submit" value="選択肢追加" class="m-2 width-font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block py-2 text-white items-center justify-center" />
        </form>
      </div>
    </transition>
    <div class="my-6" v-if="choiceError">
      <ul v-for="(err, index) in choiceError" v-bind:key="index">
        <li class="text-red">{{ err }}</li>
      </ul>
    </div>
    <hr class="border border-grey mt-5" />

    <p>問題を公開するには、10個以上の質問と、2つ以上の選択肢が必要です。</p>

    <div>
      <button v-if="moreMinimumQuery && moreMinimumChoice" @click.prevent="publishQuestion()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">問題を公開する</button>
      <button v-if="moreMinimumQuery && moreMinimumChoice" @click.prevent="draftQuestion()" class="block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">問題を下書きにする</button>
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
      choice: {},
      queries: [],
      choices: [],
      queryOpen: false,
      choiceOpen: false,
      editChoiceOpen: false,
      error: '',
      queryError: '',
      choiceError: '',
      message: '',
      queryMessage: '',
      choiceMessage: '',
      quiz: {},
      author: {},
      open: true
    }
  },
  filters: {
    booleanToJapanese (value) {
      if (value === true || value === 'true') {
        return '正解'
      } else {
        return '不正解'
      }
    },
    categoryToJapanese (value) {
      switch (value) {
        case '不明':
          return '不明'
        case 'Who':
          return '人物について'
        case 'What':
          return '出来事について'
        case 'When':
          return '時間について'
        case 'Where':
          return '場所について'
        case 'Why':
          return '理由について'
        case 'How':
          return '方法について'
      }
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
    moreMinimumChoice () {
      if (this.choices.length > 1 && this.hasOneRightChoice) {
        return true
      } else {
        return false
      }
    },
    hasOneRightChoice () {
      return this.choices.some(choice => choice.correctness)
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
    this.checkSignedIn()
    this.fetchQuiz()
  },
  methods: {
    checkSignedIn () {
      if (!localStorage.signedIn) {
        this.$router.replace('/')
      }
    },
    fetchQuiz () {
      const quizId = this.$route.params.id
      this.$http.secured.get(`/api/v1/quizzes/${quizId}`)
        .then(response => {
          this.quiz = response.data.quiz
          if (parseInt(this.quiz.author.id) !== parseInt(this.$store.getters.uid)) {
            this.$router.go(-1)
          }
          this.fetchQueries(this.quiz.id)
          this.fetchChoices(this.quiz.id)
        })
        .catch(error => this.setError(error, '問題検索時エラー： なにかがおかしいです。'))
    },
    showDeleteDialog (id, doneHandler) {
      this.$modal.show('dialog', {
        title: '確認',
        text: '本当に削除してよいですか？',
        buttons: [
          {
            title: '削除する',
            handler: () => {
              doneHandler(id)
              this.$modal.hide('dialog')
            }
          },
          {
            title: 'しない',
            default: true
          }
        ]
      })
    },
    resetAllMessages () {
      this.error = ''
      this.queryError = ''
      this.choiceError = ''
      this.message = ''
      this.queryMessage = ''
      this.choiceMessage = ''
    },
    toggleQuery () {
      if (!this.queryOpen) {
        this.resetAllMessages()
      }
      this.queryOpen = !this.queryOpen
    },
    toggleChoice () {
      if (!this.choiceOpen) {
        this.resetAllMessages()
      }
      this.choiceOpen = !this.choiceOpen
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    setQueryError (error, text) {
      this.queryError = (error.response && error.response.data && error.response.data.error) || text
    },
    setChoiceError (error, text) {
      this.choiceError = (error.response && error.response.data && error.response.data.error) || text
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
          this.queryMessage = '質問を作成しました！'
          this.toggleQuery()
        })
        .catch(error => this.setQueryError(error, '質問の作成に失敗しました'))
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
          this.choiceMessage = '選択肢を作成しました！'
          this.toggleChoice()
          this.choiceError = ''
        })
        .catch(error => this.setChoiceError(error, '選択肢の作成に失敗しました。'))
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
    jumpToEditQuiz (quizId) {
      this.$router.push(`/quizzes/${quizId}/edit`)
    },
    jumpToQuery (queryId) {
      this.$router.push(`/queries/${queryId}/edit`)
    },
    deleteQuiz (quizId) {
      this.$http.secured.delete(`/api/v1/quizzes/${this.$route.params.id}`)
        .then(response => {
          const quiz = response.data
          return this.$router.push({name: 'Mypage', params: { message: `問題「${quiz.title}」を削除しました` }})
        })
        .catch(error => {
          this.setError(error, '問題削除時エラー：　なにかがおかしいです。')
        })
    },
    deleteQuery (queryId) {
      this.$http.secured.delete(`/api/v1/quizzes/${this.$route.params.id}/queries/${queryId}`)
        .then(response => {
          const returndQuery = response.data
          this.queryMessage = `「${returndQuery.body}」という質問を削除しました`
          this.queries = this.queries.filter(query => query.id !== returndQuery.id)
        })
        .catch(error => {
          this.setError(error, '質問削除時エラー：　なにかがおかしいです。')
        })
    },
    toggleEditChoice (choiceId) {
      const choice = this.choices.filter(choice => choice.id === choiceId)[0]
      this.choices.forEach(choice => { choice.editOpen = false })
      choice.editOpen = true
      this.editChoiceOpen = !this.editChoiceOpen
    },
    choiceEditOpened (choice) {
      return choice.editOpen
    },
    patchChoice (choiceId) {
      if (choiceId) {
        const choice = this.choices.filter(choice => choice.id === choiceId)[0]
        this.$http.secured.patch(`/api/v1/quizzes/${this.quiz.id}/choices/${choiceId}`, { choice: { body: choice.body, correctness: choice.correctness } })
          .then(response => {
            const returnedChoice = response.data
            this.choices.forEach(choice => {
              if (choice.id === returnedChoice.id) {
                choice = returnedChoice
              }
            })
            this.choiceMessage = '選択肢を編集しました！'
            this.toggleEditChoice(choiceId)
          })
          .catch(error => this.setError(error, ['選択肢の編集に失敗しました。']))
      }
    },
    deleteChoice (choiceId) {
      this.$http.secured.delete(`/api/v1/quizzes/${this.quiz.id}/choices/${choiceId}`)
        .then(response => {
          const returnedChoice = response.data
          this.choiceMessage = `「${returnedChoice.body}」という選択肢を削除しました`
          this.choices = this.choices.filter(choice => choice.id !== returnedChoice.id)
        })
        .catch(error => {
          this.setError(error, '質問削除時エラー：　なにかがおかしいです。')
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
