import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    count: 0,
    localStorage: localStorage.signedIn
  },

  getters: {
    localStorage (state) { return state.localStorage }
  },

  mutations: {
    localStorageSignedSwitch (state, payload) {
      state.localStorage ? state.localStorage = false : state.localStorage = true
    }
  },

  actions: {
    switchLogin ({commit}, payload) {
      commit('localStorageSignedSwitch', payload)
    }
  }

})

export default store
