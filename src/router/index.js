import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin.vue'
import Signup from '@/components/Signup.vue'
import User from '@/components/User.vue'
import Quiz from '@/components/quizzes/Quiz.vue'
import NotFound from '@/components/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/users',
      name: 'User',
      component: User
    },
    {
      path: '/quizzes',
      name: 'Quiz',
      component: Quiz
    },
    { path: '*',
      name: 'NotFound',
      component: NotFound }
  ]
})
