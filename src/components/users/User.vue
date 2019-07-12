<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>
    <hr class="border border-grey" />
    <UserDescription v-bind="user" v-bind:avatar="avatar" />
    <hr class="border border-grey" />
  </div>

</template>

<script>
import UserDescription from '@/components/designs/organisms/UserDescription.vue'
export default {
  name: 'User',
  components: { UserDescription },
  data () {
    return {
      user: {},
      avatar: '',
      error: ''
    }
  },
  created () {
    const id = this.$route.params.id
    this.$http.secured.get(`/api/v1/users/${id}`)
      .then(response => {
        this.user = response.data.user
        this.avatar = response.data.avatar
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
