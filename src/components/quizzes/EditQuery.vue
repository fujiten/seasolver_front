<template>
  <div class="max-w-md m-auto py-10">
    <form @submit.prevent="patchQuery()">
      <div class="m-6">
        {{ message }}
        <label for="query_category" class="label">カテゴリ</label>
        <select
          id="query_category"
          class="mt-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          v-model.number="query.category"
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
          class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="男がウミガメのスープを食べたのは初めてでしたか？"
          v-model="query.body"
        />
      </div>

      <div class="m-6">
        <label for="query_answer" class="label">回答</label>
        <textarea
          id="query_answer"
          class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="いいえ。以前にもどこかで食べたことがありました。"
          v-model="query.answer"
        />
      </div>

      <div class="m-6">
        <label for="query_point" class="label">獲得ポイント</label>
        <input
          id="query_point"
          class="my-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="1"
          type="number"
          min="0"
          v-model.number="query.point"
        />
        <p>pt ( 設定：この質問を行うと得られるポイント)</p>
      </div>

      <div class="m-6">
        <label for="query_revealed_point" class="label">開示ポイント</label>
        <input
          id="query_revealed_point"
          class="my-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="10"
          type="number"
          min="0"
          v-model.number="query.revealed_point"
        />
        <p>pt ( 設定：この質問を出現させるために必要なポイント)</p>
      </div>
      <input type="submit" value="編集する" class="width-font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block py-4 text-white items-center justify-center" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditQuery',
  data () {
    return {
      query: {},
      message: ''
    }
  },
  created () {
    this.fetchQuery()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchQuery () {
      this.$http.secured.get(`/api/v1/queries/${this.$route.params.id}`)
        .then(response => {
          this.query = response.data
        })
        .catch(error => {
          this.setError(error, '質問検索時エラー：　なにかがおかしいです。')
        })
    },
    patchQuery () {
      const value = this.query
      if (!value) {
        return
      }
      this.$http.secured.patch(`/api/v1/queries/${this.$route.params.id}`,
        { query: { category: this.query.category,
          body: this.query.body,
          answer: this.query.answer,
          point: this.query.point,
          revealed_point: this.query.revealed_point} })
        .then(response => {
          const quizId = response.data.quiz_id
          this.query = {}
          this.$router.push({name: 'Quiz', params: { id: `${quizId}`, message: '質問を編集しました!' }})
        })
        .catch(error => this.setError(error, '質問の編集に失敗しました。'))
    }
  }
}
</script>
