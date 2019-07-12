import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    signedIn: localStorage.signedIn,
    myAvatar: localStorage.myAvatar,
    quiz: '',
    author: ''
  },

  getters: {
    signedIn (state) { return state.signedIn },
    myAvatar (state) { return state.myAvatar },
    quiz (state) { return state.quiz },
    author (state) { return state.author }
  },

  mutations: {
    localStorageSignedSwitch (state, payload) {
      state.signedIn ? state.signedIn = false : state.signedIn = true
    },
    setMyAvatar (state, payload) {
      state.myAvatar = payload
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
    setMyAvatar ({commit}, payload) {
      commit('setMyAvatar', payload)
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
