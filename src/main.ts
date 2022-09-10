import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'

import App from './App.vue'
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => { // 在全局设置使用interceptor来拦截当前应用的请求并加入逻辑实现需求的方法
  config.params = { ...config.params, icode: '17E8D97C11A405CD' }
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => { // 在全局设置使用interceptor来拦截当前应用的请求并加入逻辑实现需求的方法
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 2000)
  return config
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
