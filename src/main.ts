import { createApp } from 'vue'
import axios from 'axios'
import router from './router'
import store from './store'

import App from './App.vue'
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: '17E8D97C11A405CD' } // get 请求，添加到 url 中
  /*
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '******')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '******' }
  }
  */
  return config
})
axios.get('/columns', { params: { key: 'hello' } }).then(resp => {
  console.log(resp.data)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
