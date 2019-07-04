import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin.vue'
import Signup from '@/components/Signup.vue'
import Users from '@/components/users/Users.vue'
import User from '@/components/users/User.vue'
import EditUser from '@/components/users/EditUser.vue'
import Mypage from '@/components/users/Mypage.vue'
import Quizzes from '@/components/quizzes/Quizzes.vue'
import Quiz from '@/components/quizzes/Quiz.vue'
import CreateQuiz from '@/components/quizzes/CreateQuiz'
import EditQuery from '@/components/quizzes/EditQuery'
import NotFound from '@/components/NotFound.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signin',
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
      name: 'Users',
      component: Users
    },
    {
      path: '/users/:id',
      name: 'User',
      component: User
    },
    {
      path: '/mypage',
      name: 'Mypage',
      component: Mypage
    },
    {
      path: '/users/:id/edit',
      name: 'EditUser',
      component: EditUser
    },
    {
      path: '/',
      name: 'Quizzes',
      component: Quizzes
    },
    {
      path: '/quizzes/new',
      name: 'CreateQuiz',
      component: CreateQuiz
    },
    {
      path: '/quizzes/:id',
      name: 'Quiz',
      component: Quiz
    },
    {
      path: '/queries/:id/edit',
      name: 'EditQuery',
      component: EditQuery
    },
    { path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
