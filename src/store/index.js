import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    localStorage: localStorage.signedIn,
    uid: localStorage.uid
  },

  getters: {
    localStorage (state) { return state.localStorage },
    uid (state) { return state.uid }
  },

  mutations: {
    localStorageSignedSwitch (state, payload) {
      state.localStorage ? state.localStorage = false : state.localStorage = true
    },
    setUserIdtoStore (state, payload) {
      state.uid = payload
    }
  },

  actions: {
    switchLogin ({commit}, payload) {
      commit('localStorageSignedSwitch', payload)
    },
    setUserId ({commit}, payload) {
      commit('setUserIdtoStore', payload)
    }
  }

})

export default store
