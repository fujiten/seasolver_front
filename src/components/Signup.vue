<template>
  <div class="max-w-sm m-auto my-8">
    <div class="border p-10 border-grey-light shadow rounded">
      <h3 class="text-2xl mb-10 text-center">新規登録</h3>
      <form @submit.prevent="signup">
        <div class="text-red mb-5" v-if="error">{{ error }}</div>

        <div class="mb-6">
          <label for="email" class="label">メールアドレス <span class="bg-red rounded p-1 text-sm text-white">必須</span></label>
          <input type="email" v-model="email" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" placeholder="seasolver@example.com">
        </div>

        <div class="mb-6">
          <label for="name" class="label">ニックネーム <span class="bg-red rounded p-1 text-sm text-white">必須</span></label>
          <input type="text" v-model="name" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="ウミガメさん">
        </div>

        <div class="input_container">
          <label for="name" class="label">パスワード <span class="bg-red rounded p-1 text-sm text-white">必須</span></label>
          <input class="mt-1 mb-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" @input="p_len" v-model="password" placeholder="6文字以上" />
          <span v-bind:class="{ valid_password_length: valid_password_length , show_password_length: typed}" class="password_length">{{password_length}}</span>
        </div>

        <div class="lnu_container">
          <p v-bind:class="{ lovercase_valid: contains_lovercase }">小文字</p>
          <p v-bind:class="{ number_valid: contains_number }">数字</p>
          <p v-bind:class="{ uppercase_valid: contains_uppercase }">大文字</p>
        </div>

        <div class="mt-3 mb-6">
          <label for="password" class="label">確認用パスワード <span class="bg-red rounded p-1 text-sm text-white">必須</span></label>
          <input type="password" v-model="password_confirmation" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password_confirmation">
        </div>

        <button type="submit" class="mt-3 font-sans font-bold px-4 rounded cursor-pointer
        no-underline bg-green hover:bg-green-dark block w-full py-4 text-white items-center justify-center">新規登録</button>

      <h3 class="text-sm mt-8 text-center">すでにアカウントをお持ちの方はこちら</h3>
      <div class="mb-10">
        <a href="#" @click.prevent="jumpToSignIn()" class="mt-2 font-sans font-bold px-4 rounded cursor-pointer
        no-underline bg-blue hover:bg-blue-dark text-center block w-full py-3 text-white items-center justify-center">ログイン画面</a>
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
      error: '',
      password_length: 0,
      typed: false,
      contains_lovercase: false,
      contains_number: false,
      contains_uppercase: false,
      valid_password_length: false,
      valid_password: false
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  computed: {
    checkPasswordLength () {
      if (this.password.length < 5) {
        return 'パスワードは6文字以上必要です。'
      } else {
        return ''
      }
    }
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
    },
    jumpToSignIn () {
      this.$router.push('/signin')
    },
    p_len () {
      this.password_length = this.password.length
      if (this.password_length > 5) {
        this.valid_password_length = true
      } else {
        this.valid_password_length = false
      }

      if (this.password_length > 0) {
        this.typed = true
      } else {
        this.typed = false
      }

      this.contains_lovercase = /[a-z]/.test(this.password)
      this.contains_number = /\d/.test(this.password)
      this.contains_uppercase = /[A-Z]/.test(this.password)

      // Check if the password is valid
      if (this.contains_lovercase === true && this.contains_number === true) {
        this.valid_password = false
        if (
          this.contains_uppercase === true &&
          this.valid_password_length === true
        ) { this.valid_password = true }
      } else {
        this.valid_password = false
      }
    }
  }
}
</script>

<style scoped>

.input_container {
  display: block;
  margin: 0 auto;
  height: auto;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

#app input[type="password"] {

}

#app input[type="password"]:focus {
  border: 1px solid #2196F3;
}

.password_length {
  padding: 2px 10px;
  position: absolute;
  top: 65%;
  right: 10px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  background: #FBD490;
  color: rgba(71, 87, 98, .8);
  border-radius: 4px;
  font-size: 13px;
  display: none;
  -webkit-transition: all .1s;
  transition: all .1s;
}

.valid_password_length {
  background: #00AD7C;
  color: rgba(255, 255, 255, .9);
}

.show_password_length {
  display: block;
}

.lnu_container {
  display: block;
  margin: 10px auto;
  width: 320px;
  height: auto;
  display: flex;
  justify-content: space-between;
}

.lnu_container p {
  width: 100px;
  height: auto;
  font-size: 12px;
  line-height: 1.2;
  text-align: center;
  border-radius: 2px;
  color: rgba(71, 87, 98, .8);
  background: linear-gradient(to right, #00AD7C 50%, #eee 50%);
  background-size: 201% 100%;
  background-position: right;
  -webkit-transition: background .3s;
  transition: background .3s;
}

.lovercase_valid,
.number_valid,
.uppercase_valid {
  background-position: left !important;
  color: rgba(255, 255, 255, .9) !important;
}

.valid_password_container {
  display: block;
  margin: 10px auto;
  border-radius: 4px;
  position: relative;
  background: #00AD7C;
  width: 20px;
  height: 20px;
  visibility: hidden;
  opacity: 0;
}

.show_valid_password_container {
  visibility: visible;
  opacity: 1;
}

.tick {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: white;
  stroke-width: 25;
  stroke-linecap: round;
  stroke-dasharray: 180;
  stroke-dashoffset: 180;
}

.checked {
  -webkit-animation: draw 0.5s ease forwards;
  animation: draw 0.5s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

</style>
