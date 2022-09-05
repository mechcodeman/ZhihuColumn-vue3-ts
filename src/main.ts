import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import App from './App.vue'

const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    add (state) {
      state.count++
    }
  }
})
console.log(store.state.count) // 存放数据的拿取方式
store.commit('add') // 使用commit命令调用mutations中定义的方法
console.log(store.state.count)

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    }
  ]
})
const app = createApp(App)
app.use(router)
app.mount('#app')
