<template>
  <div class="max-w-sm m-auto my-8">
    <div class="border p-10 border-grey-light shadow rounded">
      <h3 class="text-sm mb-1 text-center">アカウントをお持ちでない方はこちら</h3>
      <div class="mb-10">
        <a href="#" @click.prevent="jumpToSignUp()" class="font-sans font-bold px-4 rounded cursor-pointer
        no-underline bg-blue hover:bg-blue-dark text-center block w-full py-3 text-white items-center justify-center">新規登録</a>
      </div>
      <form @submit.prevent="signin">
        <div class="text-red">{{ $route.params.error }}</div>
        <div class="text-red" v-if="error">{{ error }}</div>

        <div class="mb-3">
          <input type="email" v-model="email" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" placeholder="メールアドレス">
        </div>

       <div class="mb-6">
          <input type="password" v-model="password" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" placeholder="パスワード">
        </div>

        <button type="submit" class="font-sans font-bold px-4 rounded cursor-pointer
        no-underline bg-green hover:bg-green-dark block w-full py-4 text-white items-center justify-center">ログイン</button>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signin',
  data () {
    return {
      email: '',
      password: '',
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
    signin () {
      this.$http.plain.post('/signin', {email: this.email, password: this.password})
        .then(response => this.signinSuccesful(response))
        .catch(error => this.signinFailed(error))
    },
    signinSuccesful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      this.error = ''
      localStorage.signedIn = true
      this.$store.dispatch('switchLogin')

      localStorage.csrf = response.data.csrf
      localStorage.access = response.data.access

      this.$router.replace('/')
    },
    signinFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
      delete localStorage.csrf
      delete localStorage.signedIn
    },
    checkSignedIn () {
      if (localStorage.signedIn) {
        this.$router.replace('/')
      }
    },
    jumpToSignUp () {
      this.$router.push('/signup')
    }
  }
}
</script>
