import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    localStorage: localStorage.signedIn,
    uid: localStorage.uid,
    quiz: '',
    author: ''
  },

  getters: {
    localStorage (state) { return state.localStorage },
    uid (state) { return state.uid },
    quiz (state) { return state.quiz },
    author (state) { return state.author }
  },

  mutations: {
    localStorageSignedSwitch (state, payload) {
      state.localStorage ? state.localStorage = false : state.localStorage = true
    },
    setUserIdtoStore (state, payload) {
      state.uid = payload
    },
    setQuiz (state, payload) {
      state.quiz = payload
    },
    setAuthor (state, payload) {
      state.author = payload
    }
  },

  actions: {
    switchLogin ({commit}, payload) {
      commit('localStorageSignedSwitch', payload)
    },
    setUserId ({commit}, payload) {
      commit('setUserIdtoStore', payload)
    },
    setQuiz ({commit}, payload) {
      commit('setQuiz', payload)
    },
    setAuthor ({commit}, payload) {
      commit('setAuthor', payload)
    }
  }

})

export default store
