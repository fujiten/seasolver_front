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
        <div class="text-red text-sm" v-if="error">{{ error }}</div>

        <div class="mb-3">
          <input type="email" v-model="email" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" placeholder="メールアドレス">
        </div>

       <div class="mb-6">
          <input type="password" v-model="password" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" placeholder="パスワード">
        </div>

        <button type="submit" class="font-sans font-bold px-4 rounded cursor-pointer
        no-underline bg-green hover:bg-green-dark block w-full py-4 text-white">ログイン</button>

      </form>
      <hr class="border border-grey" />
      <div class="flex justify-center">
        <button @click="signinWithTwitter()" class="twitter mt-10 font-sans font-bold px-4 py-3 rounded cursor-pointer
        no-underline block text-white">
          Twitterアカウントでログイン
        </button>
      </div>
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
      this.$http.secured.post('/signin', {email: this.email, password: this.password})
        .then(response => this.signinSuccesful(response))
        .catch(error => this.signinFailed(error))
    },
    signinWithTwitter () {
      this.$http.secured.get('/authenticate')
        .then(response => {
          if (response.data.status === 'authentication_success') {
            this.signinSuccesful(response)
          } else if (response.data.status === 'return_callback_url') {
            location.href = response.data.oauth_url
          } else if (response.data.status === 'authentication_failed') {
            document.cookie = 'token_validness=false;'
            alert('ログインに失敗しました。')
          } else {
            document.cookie = 'token_validness=false;'
            alert('ログインに失敗しました。')
          }
        })
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
      localStorage.myAvatar = response.data.my_avatar
      this.$store.dispatch('setMyAvatar', response.data.my_avatar)

      localStorage.uid = response.data.uid
      this.$store.dispatch('setUid', response.data.uid)
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

<style scoped>

.twitter {
  background-color: #38A1F3;
}

.twitter:hover{
  background-color: rgb(31, 128, 203);
}
</style>
