<template>
  <div>

    <div class="flex justify-end">
      <a @click.prevent="toggleAnswer()" class="inline-block bg-transparent text-sm hover:bg-indigo hover:text-white text-indigo border border-indigo no-underline font-bold py-2 px-4 mr-2 rounded">
        <font-awesome-icon icon="lightbulb" size="lg" class="mr-2" />最終回答する
      </a>
    </div>

    <transition name="fade">
      <div v-if="confirmedOpen">
        <hr class="border border-grey " />
        <p class="mt-4">複数の選択肢の中から正解を選んで下さい。</p>
        <p>誤った場合は最終スコアが下がります。</p>
        <p class="font-bold mt-2">＜注意＞「選択肢の表示」ボタンを押したあとは、回答を終えるまで新たに質問することは出来ません！</p>
        <a @click.prevent="toggleChoices()" class="inline-block mt-3 mb-3 bg-transparent text-sm hover:bg-indigo hover:text-white text-indigo border border-indigo no-underline font-bold py-2 px-4 mr-2 rounded">
          <font-awesome-icon icon="lightbulb" size="lg" class="mr-2" />選択肢の表示
        </a>
      </div>
    </transition>

    <div>
      <transition name="fade">
        <ul v-if="choicesOpen" class="mt-2" >
          <p>選択肢一覧</p>
          <li v-for="choice in choices" :key="choice.id">
            <div @click.prevent="selectChoice(choice.id, choice.correctness)" class="border border-black rounded mt-2 hover:bg-grey-lighter">
              <div class="px-2 py-4">
                <p class="m-2">
                  <span class="font-bold"> A.</span>
                  {{ choice.body }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </transition>
    </div>
    <p class="my-1 text-indigo-darker"> {{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    choices: Array
  },
  data () {
    return {
      confirmedOpen: false,
      choicesOpen: false,
      message: ''
    }
  },
  methods: {
    toggleAnswer () {
      this.confirmedOpen = !this.confirmedOpen
      this.message = ''
    },
    toggleChoices () {
      this.choicesOpen = !this.choicesOpen
      // this.scrollView()
      this.$emit('closeExceptMe')
    },
    selectChoice (choiceId, correctness) {
      if (correctness) {
        this.$emit('selectRightChoice')
        this.message = '正解です！'
      } else {
        this.$emit('selectWrongChoice')
        this.message = '誤った選択肢を選びました。誤答数が＋１されます。'
        this.confirmedOpen = false
        this.choicesOpen = false
      }
    },
    scrollView () {
      // 調整中...
      // const element = document.getElementById('scrollPoint')
      // element.scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  }
}
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s, transform .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

</style>
