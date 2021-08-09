import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './i18n/i18n.js'
import Notify from './components/message/index'
import common from './utils/common'
import './directives/index'
// 引入 axios
import axios from 'axios'
Vue.prototype.$axios = axios

// 引入socket.io.client
import socketio from 'socket.io-client'
Vue.prototype.$io = socketio('http://localhost:3000', {

  transports: ['websocket'],
})
Vue.config.productionTip = false


Vue.prototype.$snackbar = Notify;
Vue.prototype.$common = common;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')

