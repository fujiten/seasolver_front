<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red m-6" v-if="error">{{ error }}</div>
    <h1 class="mb-3 text-lg font-bold text-center">プロフィール編集</h1>
    <hr class="border border-grey" />
    <form @submit.prevent="patchUser()">
      <div class="m-4">
        <div class="flex items-center">
          <label>
            <img class="w-24 h-24 rounded-full mr-4 bg-hover" v-lazy="avatar" alt="Avatar">
            <UserImageUploader
              v-bind="user"
              :params="{ limit: 1000, unit: 'kb', allow: 'jpg,png' }"
              v-model="avatar"
            />
          </label>

          <div>
            <label for="user_name" class="label">名前</label>
            <input
              id="user_name"
              class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              autofocus autocomplete="off"
              v-model="user.name"
            />
              <p class="mt-2">Lv. {{ user.level }}</p>
          </div>
        </div>
        <div class="mt-2">
          <label for="user_description" class="label">コメント</label>
          <textarea
            id="user_description"
            class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            autofocus autocomplete="off"
            placeholder="例）好きなスープはポトフです。"
            v-model="user.description"
          />
        </div>
      </div>
      <hr class="border border-grey my-6" />
      <div class="flex justify-end">
        <input type="submit" value="編集する" class="font-bold mr-4 px-4 py-3 rounded cursor-pointer bg-green hover:bg-green-dark block text-white" />
      </div>
    </form>
  </div>
</template>

<script>
import UserImageUploader from '@/components/designs/organisms/UserImageUploader.vue'
export default {
  name: 'EditUser',
  components: { UserImageUploader },
  data () {
    return {
      user: {},
      avatar: '',
      message: '',
      error: ''
    }
  },
  created () {
    this.fetchUser()
  },
  methods: {
    setError (error, text) {
      console.log(error.response.data)
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchUser () {
      this.$http.secured.get(`/api/v1/users/${this.$route.params.id}`)
        .then(response => {
          this.user = response.data.user
          this.avatar = response.data.avatar
        })
        .catch(error => {
          this.setError(error, 'ユーザー検索時エラー：　なにかがおかしいです。')
        })
    },
    patchUser () {
      this.$http.secured.patch(`/api/v1/users/${this.$route.params.id}`,
        { user:
          { name: this.user.name,
            description: this.user.description },
        avatar:
          { image: this.avatar }
        })
        .then(response => {
          this.$router.push({name: 'Mypage', params: { message: 'プロフィールを編集しました!' }})
        })
        .catch(error => this.setError(error, 'プロフィールの編集に失敗しました。'))
    },
    updateAvatar () {
      let formData = new FormData()
      formData.append('image', this.avatar)
      this.$http.secured.patch(`/api/v1/avatars/${this.id}`, formData)
        .then(response => {
          this.avatar = {}
          this.$router.push({name: 'Mypage', params: { message: 'アイコンを設定しました!' }})
        })
        .catch(error => {
          this.setError(error, '画像のアップロードに失敗しました。')
        })
    }
  }
}
</script>

<style scoped>

.bg-hover:hover {
  opacity: 0.7;
}
</style>
