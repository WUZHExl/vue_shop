import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'



import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/'

// 在请求或响应被 then 或 catch 处理前拦截它们。
// 添加请求拦截器
// 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
axios.interceptors.request.use(function(config){
  // console.log(config)
  // 在发送请求之前做些什么
  config.headers.Authorization=sessionStorage.getItem('token')
  // 一定要返回的
  return config
})

Vue.prototype.$http=axios


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
