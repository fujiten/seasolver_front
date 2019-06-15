<template>
  <div>
    <div class="max-w-md m-auto py-10">
      <div class="text-red" v-if="error">{{ error }}</div>
      <div>
        <p class="font-bold">マイページへようこそ！</p>
        <p>ユーザー名：「{{ user.name }}」</p>
        <p>ユーザーレベル：{{ user.level }}</p>
        <p>作った問題一覧：準備中...</p>
      </div>

      <div class="mt-5">
        <button  @click.prevent="toggleMyDraftedQuestions()" class="inlien-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">▼下書き問題一覧</button>
        <button  @click.prevent="toggleMyPublishedQuestions()" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">▼公開済み問題一覧</button>
        <button  @click.prevent="toggleMyTryingQuestions()" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">▼挑戦中問題一覧</button>
        <transition name="left">
          <div  v-if="openDrafted">
            <p>下書き問題一覧</p>
            <ul>
              <li class="py-4" v-for="draftedQuiz in draftedQuizzes" :key="draftedQuiz.id">
                {{ draftedQuiz.title }}
                <a href="#" @click.prevent="jumpToQuiz(draftedQuiz.id)" class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">詳細</a>
              </li>
            </ul>
          </div>
        </transition>
        <transition name="left">
          <div v-if="openPublished">
            <p>公開済み問題一覧</p>
            <ul>
              <li class="py-4" v-for="publishedQuiz in publishedQuizzes" :key="publishedQuiz.id">
                {{ publishedQuiz.title }}
                <a href="#" @click.prevent="jumpToQuiz(publishedQuiz.id)" class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">詳細</a>
              </li>
            </ul>
          </div>
        </transition>
        <transition name="left">
          <div v-if="openTrying">
            <p>挑戦中問題一覧</p>
            <ul>
              <li class="py-4" v-for="tryingQuiz in tryingQuizzes" :key="tryingQuiz.id">
                {{ tryingQuiz.title }}
                <a href="#" @click.prevent="jumpToQuiz(tryingQuiz.id)" class="bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded">詳細</a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Mypage',
  data () {
    return {
      user: {},
      error: '',
      draftedQuizzes: {},
      publishedQuizzes: {},
      tryingQuizzes: {},
      openDrafted: false,
      openPublished: false,
      openTrying: false
    }
  },
  created () {
    this.checkSignedIn()
    this.fetchMyUserInfo()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchMyUserInfo () {
      this.$http.secured.get(`/api/v1/users/show_mypage`)
        .then(response => {
          this.user = response.data.current_user
          this.draftedQuizzes = response.data.my_quizzes.drafted
          this.publishedQuizzes = response.data.my_quizzes.published
          this.tryingQuizzes = response.data.trying_quizzes
        })
        .catch(error => {
          this.setError(error, 'ユーザー情報検索時エラー：　なにかがおかしいです。')
        })
    },
    jumpToQuiz (quizId) {
      this.$router.push(`quizzes/${quizId}`)
    },
    checkSignedIn () {
      if (!localStorage.signedIn) {
        this.$router.replace('/')
      }
    },
    toggleMyDraftedQuestions () {
      this.openDrafted = !this.openDrafted
      this.openPublished = false
      this.openTrying = false
    },
    toggleMyPublishedQuestions () {
      this.openPublished = !this.openPublished
      this.openDrafted = false
      this.openTrying = false
    },
    toggleMyTryingQuestions () {
      this.openTrying = !this.openTrying
      this.openDrafted = false
      this.openPublished = false
    }
  }
}
</script>

<style scoped>

.left-enter-active, .left-leave-active {
  transform: translate(0px, 0px);
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms,
              opacity 0.8s;
  position: absolute;
}

.left-enter, .left-leave-to {
  transform: translateX(-100vw) translateX(0px);
  opacity: 0;
}

</style>
