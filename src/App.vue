<template>
  <div class="container">
    <global-true-header :user="currentUser"></global-true-header>
    <home></home>
    <login></login>
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
    GlobalTrueHeader,
    Home,
    Login
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
