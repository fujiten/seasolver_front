<template>
  <div>
    <div class="max-w-md m-auto py-10">
      <div class="my-6" v-if="error">
        <ul v-for="(err, index) in error" v-bind:key="index">
          <li class="text-red">{{ err }}</li>
        </ul>
      </div>
      <div>{{ $route.params.message }}</div>
      <hr class="border border-grey" />
      <div class="flex justify-between relative">
        <UserDescription v-bind="user" v-bind:avatar="avatar" class="mt-6 mb-4" />
        <DropdownButton v-bind:dropdownList="dropdownList" class="mr-2" />
      </div>

      <hr class="border border-grey my-6" />
      <div>
        <div>
          <TabItem
            v-for="content in tabContentsList"
            v-bind="content" :key="content.id"
            v-model="currentId"/>
        </div>
        <div class="border-t border-black y-full">
          <section v-for="content in tabContentsList" :key="content.id">
            <TabContent
              v-if="currentId === content.id"
              v-bind:quizzes="content.quizzes"/>
          </section>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import DropdownButton from '@/components/designs/atoms/DropdownButton.vue'
import TabItem from '@/components/designs/organisms/TabItem.vue'
import TabContent from '@/components/designs/organisms/TabContent.vue'
import UserDescription from '@/components/designs/organisms/UserDescription.vue'
export default {
  name: 'Mypage',
  components: { DropdownButton, TabItem, TabContent, UserDescription },
  data () {
    return {
      error: '',
      user: {},
      avatar: '',
      openDropdown: false,
      currentId: 1,
      dropdownList: [
        { id: 1, label: 'プロフィール編集', method: this.jumpToUserEditPage, icon: {name: 'edit', size: 'lg'} },
        { id: 2, label: '詳細設定(準備中)', method: this.jumpToUserEditPage, icon: {name: 'info-circle', size: 'lg'} }
      ],
      tabContentsList: {
        drafted: { id: 1, label: '仮作成の問題', quizzes: [] },
        published: { id: 2, label: '公開済みの問題', quizzes: [] },
        trying: { id: 3, label: '挑戦中の問題', quizzes: [] }
      }
    }
  },
  created () {
    this.checkSignedIn()
    this.fetchMyUserInfo()
  },
  updated () {
    this.checkSignedIn()
  },
  computed: {
    currentItem () {
      return this.list.find(el => el.id === this.currentId) || {}
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    fetchMyUserInfo () {
      this.$http.secured.get(`/api/v1/users/show_mypage`)
        .then(response => {
          this.user = response.data.current_user
          this.avatar = response.data.avatar
          this.tabContentsList.drafted.quizzes = response.data.my_quizzes.drafted
          this.tabContentsList.published.quizzes = response.data.my_quizzes.published
          this.tabContentsList.trying.quizzes = response.data.trying_quizzes
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
    dropdown () {
      this.openDropdown = !this.openDropdown
    },
    jumpToUserEditPage () {
      this.$router.push(`users/${this.user.id}/edit`)
    }
  }
}
</script>

<style scoped>

.left-enter, .left-leave-to {
  transform: translateX(-100vw) translateX(0px);
  opacity: 0;
}

.list-enter-active, .list-leave-active {
  transform: translate(0px, 0px);
  transition: transform 5ms cubic-bezier(0, 0, 0.2, 1) 0ms,
              opacity 0.2s;
  position: relative;
}

.list-enter, .list-leave-to {
  transform: translateX(0vw) translateX(0px);
  opacity: 0;
}

.item {
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
}

</style>
