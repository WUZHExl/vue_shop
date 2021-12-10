import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 依赖
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)
Vue.use(VueQuillEditor)
import axios from 'axios'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
 
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
Vue.use(VueQuillEditor)



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


Vue.filter('dataFormat',function(originVal){
  const dt=new Date(originVal)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
