<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red m-6" v-if="error">{{ error }}</div>
    <h1 class="text-lg font-bold text-center">プロフィール編集</h1>

    <form @submit.prevent="patchUser()">
      <div class="m-6">
        <label for="user_name" class="label">ユーザー名</label>
        <input
          id="user_name"
          class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          v-model="user.name"
        />
      </div>

      <div class="m-6">
        <label for="user_description" class="label">自己紹介</label>
        <textarea
          id="user_description"
          class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          autofocus autocomplete="off"
          placeholder="例）好きなスープはポトフです。"
          v-model="user.description"
        />
      </div>

      <input type="submit" value="編集する" class="m-6 width-font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block py-3 text-white items-center justify-center" />
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditUser',
  data () {
    return {
      user: {},
      message: '',
      error: ''
    }
  },
  created () {
    this.fetchUser()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchUser () {
      this.$http.secured.get(`/api/v1/users/${this.$route.params.id}`)
        .then(response => {
          this.user = response.data
        })
        .catch(error => {
          this.setError(error, 'ユーザー検索時エラー：　なにかがおかしいです。')
        })
    },
    patchUser () {
      const value = this.user
      if (!value) {
        return
      }
      this.$http.secured.patch(`/api/v1/users/${this.$route.params.id}`,
        { user: { name: this.user.name,
          description: this.user.description} })
        .then(response => {
          this.user = {}
          this.$router.push({name: 'Mypage', params: { message: 'プロフィールを編集しました!' }})
        })
        .catch(error => this.setError(error, 'プロフィールの編集に失敗しました。'))
    }
  }
}
</script>
