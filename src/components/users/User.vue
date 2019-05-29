<template>
  <div>
    <div class="text-red" v-if="error">{{ error }}</div>
    <div>
      <p>ユーザー名：「{{ user.name }}」</p>
      <p>ユーザーレベル：{{ user.level }}</p>
      <p>作った問題一覧：準備中...</p>
    </div>
  </div>

</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      user: {},
      error: ''
    }
  },
  created () {
    const id = this.$route.params.id
    this.$http.secured.get(`/api/v1/users/${id}`)
      .then(response => {
        this.user = response.data
      })
      .catch(error => this.setError(error, 'ユーザー検索時エラー：　なにかがおかしいです。'))
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    }
  }
}
</script>
