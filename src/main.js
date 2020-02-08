import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
/* 导入全局样式表 */
import "./assets/css/global.css";

import axios from "axios";
// import axios from './utils/request'
axios.defaults.baseURL = "http://server.sineava.top/api/private/v1/";

// request interceptor
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config;
}, error =>{
  return Promise.reject(error);
});

Vue.prototype.$axios = axios;

Vue.config.productionTip = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
