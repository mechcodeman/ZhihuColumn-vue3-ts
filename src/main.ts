import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'

import App from './App.vue'
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => { // 在全局设置使用interceptor来拦截当前应用的请求并加入逻辑实现需求的方法
  config.params = { ...config.params, icode: '17E8D97C11A405CD' }
  store.commit('setLoading', true)
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '17E8D97C11A405CD')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '17E8D97C11A405CD' }
  }
  return config
})
axios.interceptors.response.use(config => { // 在全局设置使用interceptor来拦截当前应用的请求并加入逻辑实现需求的方法
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 500)
  return config
}, e => { // 设置拦截错误信息
  console.log(e.response)
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error) // 抛出错误信息
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
