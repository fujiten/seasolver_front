import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import store from './store/index.js'
import router from './router'
import VueAxios from 'vue-axios'
import { securedAxiosInstance, plainAxiosInstance } from './backend/axios'
import './main.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VTooltip from 'v-tooltip'
import VModal from 'vue-js-modal'
import VueLazyload from 'vue-lazyload'

library.add(faTrashAlt, faEdit)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VTooltip)
Vue.use(VModal, { dialog: true })
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/loading.jpg',
  loading: 'dist/loading.jpg',
  attempt: 1
})

Vue.use(VueAxios, {
  secured: securedAxiosInstance,
  plain: plainAxiosInstance
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  securedAxiosInstance,
  plainAxiosInstance,
  components: { App },
  template: '<App/>'
})
