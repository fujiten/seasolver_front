<template>
  <div>
    <div class="text-red" v-if="error">{{ error }}</div>
    <div>
      <p class="font-bold">マイページへようこそ！</p>
      <p>ユーザー名：「{{ user.name }}」</p>
      <p>ユーザーレベル：{{ user.level }}</p>
      <p>作った問題一覧：準備中...</p>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Mypage',
  data () {
    return {
      user: {},
      error: ''
    }
  },
  created () {
    this.fetchMyUserInfo()
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchMyUserInfo () {
      const uid = this.$store.state.uid
      this.$http.secured.get(`/api/v1/users/${uid}`)
        .then(response => {
          this.user = response.data
          console.log(this.user)
        })
        .catch(error => this.setError(error, 'ユーザー検索時エラー：　なにかがおかしいです。'))
    },
    checkSignedIn () {
      if (!localStorage.signedIn) {
        this.$router.replace('/')
      }
    }
  }
}
</script>
