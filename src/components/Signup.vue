<template>
  <div class="max-w-sm m-auto my-8">
    <div class="border p-10 border-grey-light shadow rounded">
      <h3 class="text-2xl mb-6 text-grey-darkest">新規登録</h3>
      <form @submit.prevent="signup">
        <div class="text-red" v-if="error">{{ error }}</div>

        <div class="mb-6">
          <label for="email" class="label">メールアドレス</label>
          <input type="email" v-model="email" class="input" id="email" placeholder="seasolver@example.com">
        </div>

        <div class="mb-6">
          <label for="name" class="label">ニックネーム（登録後に変更できます）</label>
          <input type="text" v-model="name" class="input" id="name" placeholder="ウミガメさん">
        </div>

       <div class="mb-6">
          <label for="password" class="label">パスワード</label>
          <input type="password" v-model="password" class="input" id="password">
        </div>

        <div class="mb-6">
          <label for="password" class="label">確認用パスワード</label>
          <input type="password" v-model="password_confirmation" class="input" id="password_confirmation">
        </div>

        <button type="submit" class="font-sans font-bold px-4 rounded cursor-pointer
        no-underline bg-green hover:bg-green-dark block w-full py-4 text-white items-center justify-center">新規登録</button>

        <div class="my-4">
          <router-link to="/signin" class="link-grey">ログイン</router-link>
        </div>

        <div class="my-4">
          <router-link to="/users" class="link-grey">Check users</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data () {
    return {
      email: '',
      name: '',
      password: '',
      password_confirmation: '',
      error: ''
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    signup () {
      this.$http.plain.post('/signup', {email: this.email, name: this.name, password: this.password, password_confirmation: this.password_confirmation})
        .then(response => this.signupSuccesful(response))
        .catch(error => this.signupFailed(error))
    },
    signupSuccesful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      this.error = ''
      localStorage.signedIn = true
      this.$store.dispatch('switchLogin')

      localStorage.csrf = response.data.csrf

      const uid = response.data.uid
      localStorage.uid = response.data.uid
      this.$store.dispatch('setUserId', uid)

      this.$router.replace('/')
    },
    signupFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || 'Something went wrong'
      delete localStorage.csrf
      delete localStorage.signedIn
      delete localStorage.uid
    },
    checkSignedIn () {
      if (localStorage.signedIn) {
        this.$router.replace('/')
      }
    }
  }
}
</script>
