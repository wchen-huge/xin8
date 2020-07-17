import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import echarts from 'echarts'
import './assets/css/global.css'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css' // 这个nprogress样式必须引入
import axios from 'axios'
import { hasPermission } from './utils/permissionDirect'
Vue.prototype.$echarts = echarts
const Plugins = [hasPermission]
Plugins.map((plugin) => {
  Vue.use(plugin)
})
Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://www.localhost:8082/'

/**
 *  axios请求拦截器
 */
axios.interceptors.request.use(config => {
  NProgress.start() // 设置加载进度条(开始..)
  config.headers.Authorization = window.sessionStorage.getItem('JWT_TOKEN')
  return config
}
, error => {
  return Promise.reject(error)
})

/**
 * axios响应拦截器
 */
axios.interceptors.response.use(
  function (response) {
    NProgress.done() // 设置加载进度条(结束..)
    if (response.data.code === 4001) { // 如果返回的code==4002说明token错误或者token过期
      window.sessionStorage.clear()
      // var vm=new Vue();
      // vm.$message.error("您的登入状态已失效,请您重新登入~")
      return router.push('/login')
    } else {
      return response
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
