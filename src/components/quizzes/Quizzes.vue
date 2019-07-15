<template>
  <div class="max-w-md m-auto py-10 border-4 border-white">
    <div class="text-red" v-if="error">{{ error }}</div>
    <h1 class="font-mono text-3xl mb-4 ml-4">問題一覧</h1>

    <hr class="border border-grey-light my-6" />

    <ul>
      <li class="p-3 hover:bg-grey-lighter" v-for="quiz in quizzes" :key="quiz.id">
        <div @click.prevent="jumpToQuiz(quiz.id)" class="max-w-md w-full lg:flex bg-transparent">
          <div class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
            <img src="https://v0.tailwindcss.com/img/card-left.jpg">
          </div>
          <div class="w-full border-r border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div class="mb-4">
              <div class="text-black font-bold text-xl mb-2">{{ quiz.title }}</div>
              <p class="text-grey-darker text-bas">{{ quiz.question | stringSlicer }}</p>
            </div>
            <AuthorIcon v-bind="quiz" v-bind:filterMethod="countDay"/>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import AuthorIcon from '@/components/designs/molecules/AuthorIcon.vue'
export default {
  name: 'Quizzes',
  components: { AuthorIcon },
  data () {
    return {
      quizzes: [],
      error: ''
    }
  },
  filters: {
    stringSlicer (value) {
      const ReplacedValue = value.replace(/　/g, '  ')
      if (ReplacedValue.length > 70) {
        return value.slice(0, 70) + '…'
      } else {
        return ReplacedValue
      }
    },
    countDay (value) {
      const createdTime = value.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
      createdTime.shift()
      const [year, month, day, hours, minutes, seconds] = createdTime
      const createdDate = new Date(year, month - 1, day, hours, minutes, seconds)
      const today = new Date()
      const differenceOfDay = Math.floor((today - createdDate) / 86400000)
      if (differenceOfDay === 0) {
        return '今日'
      } else if (differenceOfDay === 1) {
        return '昨日'
      } else if (differenceOfDay < 10) {
        return `${differenceOfDay}日前`
      } else {
        return `${month}/${day}`
      }
    }
  },
  created () {
    this.$http.secured.get('/api/v1/quizzes')
      .then(response => {
        this.quizzes = response.data
      })
      .catch(error => this.setError(error, 'Something went wrong'))
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    jumpToQuiz (id) {
      this.$router.push(`/quizzes/${id}`)
    },
    countDay (value) {
      const createdTime = value.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/)
      createdTime.shift()
      const [year, month, day, hours, minutes, seconds] = createdTime
      const createdDate = new Date(year, month - 1, day, hours, minutes, seconds)
      const today = new Date()
      const differenceOfDay = Math.floor((today - createdDate) / 86400000)
      if (differenceOfDay === 0) {
        return '今日'
      } else if (differenceOfDay === 1) {
        return '昨日'
      } else if (differenceOfDay < 10) {
        return `${differenceOfDay}日前`
      } else {
        return `${month}/${day}`
      }
    }
  }
}
</script>
