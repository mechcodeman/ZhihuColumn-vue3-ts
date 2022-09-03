<template>
  <div class="container">
    <global-true-header :user="currentUser"></global-true-header>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-unstyled list-inline">
          <li class="list-inline-item">2022 知乎专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'

import GlobalTrueHeader, { UserProps } from './components/GlobalTrueHeader.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
const currentUser: UserProps = {
  isLogin: true,
  name: '低调的viking'
}

export default defineComponent({
  name: 'App',
  components: {
    GlobalTrueHeader
  },
  setup() {
    return {
      currentUser,
      Home
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
