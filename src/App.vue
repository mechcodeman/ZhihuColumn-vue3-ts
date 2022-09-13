<template>
  <div class="container">
    <!-- 在所有页面顶部渲染顶栏 -->
    <global-true-header :user="currentUser"></global-true-header>
    <loader v-if="isLoading"></loader>
    <!-- 通过main.ts配置关联了Home、ColumnDetail、Login三个路由 -->
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
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalTrueHeader from './components/GlobalTrueHeader.vue'
import Loader from './components/Loader.vue'
import { GlobalDataProps } from './store'
export default defineComponent({
  name: 'App',
  components: {
    GlobalTrueHeader,
    Loader
  },
  setup() {
    const store = useStore<GlobalDataProps>() // 为了获得更好的泛型自动补全支持
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    return {
      currentUser,
      isLoading
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
