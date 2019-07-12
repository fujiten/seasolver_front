<template>
  <div class="max-w-sm m-auto my-8">
    <div class="border p-10 border-grey-light shadow rounded">
      <h3 class="text-2xl mb-10 text-center">新規登録</h3>
      <form @submit.prevent="signup">

        <div v-if="error">
          <ul v-for="(err, index) in error" v-bind:key="index">
            <li class="text-red">{{ err }}</li>
          </ul>
        </div>

        <div class="mt-6 mb-6">
          <label for="email" class="label">メールアドレス <span class="bg-red rounded p-1 text-sm text-white">必須</span></label>
          <input type="email" v-model="email" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" placeholder="seasolver@example.com">
        </div>

        <div class="mb-6">
          <label for="name" class="label">ニックネーム <span class="bg-red rounded p-1 text-sm text-white">必須</span></label>
          <input type="text" v-model="name" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" placeholder="ウミガメさん">
        </div>

        <div class="input_container">
          <label for="name" class="label">パスワード <span class="bg-red rounded p-1 text-sm text-white">必須</span></label>
          <input class="mt-1 mb-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" @input="onCheckedBeValid" v-model="password" placeholder="6文字以上" />
          <span v-bind:class="{ valid_password_length: validPasswordLength, show_password_length: typed }" class="password_length">{{passwordLength}}</span>
        </div>

        <div class="validation_container">
          <p v-bind:class="{ lowercase_valid: containsLowercase }">小文字</p>
          <p v-bind:class="{ number_valid: containsNumber }">数字</p>
          <p v-bind:class="{ uppercase_valid: containsUppercase }">大文字</p>
        </div>

        <div class="mt-3 mb-6">
          <label for="password" class="label">確認用パスワード <span class="bg-red rounded p-1 text-sm text-white">必須</span></label>
          <input type="password" v-model="password_confirmation" class="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password_confirmation">
        </div>

        <button type="submit" class="mt-3 font-sans font-bold px-4 rounded cursor-pointer
        no-underline bg-blue hover:bg-blue-dark block w-full py-4 text-white items-center justify-center">新規登録</button>

      <h3 class="text-sm mt-8 text-center">すでにアカウントをお持ちの方はこちら</h3>
      <div class="mb-10">
        <a href="#" @click.prevent="jumpToSignIn()" class="mt-2 font-sans font-bold px-4 rounded cursor-pointer
        no-underline bg-green hover:bg-green-dark text-center block w-full py-3 text-white items-center justify-center">ログイン画面</a>
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
      passwordLength: 0,
      containsLowercase: false,
      containsNumber: false,
      containsUppercase: false,
      validPasswordLength: false,
      isValidPassword: false
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  computed: {
    typed () {
      return this.password.length
    }
  },
  methods: {
    signup () {
      this.$http.plain.post('/signup', {user: { email: this.email, name: this.name, password: this.password, password_confirmation: this.password_confirmation }})
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
      // localStorage.access = response.data.access
      // localStorage.myAvatar = response.data.my_avatar
      // this.$store.dispatch('setMyAvatar', response.data.my_avatar)

      this.$router.replace('/')
    },
    signupFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ['登録に失敗しました。']
      delete localStorage.csrf
      delete localStorage.signedIn
      delete localStorage.access
    },
    checkSignedIn () {
      if (localStorage.signedIn) {
        this.$router.replace('/')
      }
    },
    jumpToSignIn () {
      this.$router.push('/signin')
    },
    onCheckedBeValid () {
      this.passwordLength = this.password.length

      this.passwordLength > 5 ? this.validPasswordLength = true : this.validPasswordLength = false
      this.containsLowercase = /[a-z]/.test(this.password)
      this.containsNumber = /\d/.test(this.password)
      this.containsUppercase = /[A-Z]/.test(this.password)
    },
    checkAllValidations () {
      if (this.containsLowercase &&
          this.containsNumber &&
          this.containsUppercase &&
          this.validPasswordLength) {
        this.isValidPassword = true
      } else {
        this.isValidPassword = false
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

#app input[type="password"]:focus {
  border: 1px solid #2196F3;
}

.password_length {
  padding: 2px 10px;
  position: absolute;
  top: 65%;
  right: 10px;
  transform: translateY(-50%);
  background: #FBD490;
  color: rgba(71, 87, 98, .8);
  border-radius: 4px;
  font-size: 13px;
  display: none;
  transition: all .1s;
}

.show_password_length {
  display: block;
}

.valid_password_length {
  background: #00AD7C;
  color: rgba(255, 255, 255, .9);
}

.validation_container {
  display: block;
  margin: 10px auto;
  width: 290px;
  height: auto;
  display: flex;
  justify-content: space-between;
}

.validation_container p {
  width: 90px;
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

.lowercase_valid,
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

</style>
