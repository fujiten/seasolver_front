import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    signedIn: localStorage.signedIn,
    myAvatar: localStorage.myAvatar,
    uid: localStorage.uid
  },

  getters: {
    signedIn (state) { return state.signedIn },
    myAvatar (state) { return state.myAvatar },
    uid (state) { return state.uid }
  },

  mutations: {
    localStorageSignedSwitch (state, payload) {
      state.signedIn ? state.signedIn = false : state.signedIn = true
    },
    setMyAvatar (state, payload) {
      state.myAvatar = payload
    },
    setUid (state, payload) {
      state.uid = payload
    }
  },

  actions: {
    switchLogin ({commit}, payload) {
      commit('localStorageSignedSwitch', payload)
    },
    setMyAvatar ({commit}, payload) {
      commit('setMyAvatar', payload)
    },
    setUid ({commit}, payload) {
      commit('setUid', payload)
    }
  }
})

export default store
