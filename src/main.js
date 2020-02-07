import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
/* 导入全局样式表 */
import './assets/css/global.css'

import axios from 'axios'
// 配置默认url
axios.defaults.baseURL = 'http://server.sineava.top/api/private/v1/'

Vue.prototype.$axios = axios;

Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
