<template>
  <!-- 先展示个人专栏的信息 -->
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar" :alt="column.title" class="rounded-circle border ">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <!-- 动态渲染当前作者的所有专栏文章，list将子组件PostList所需参数传输过去，子组件用props接收 -->
    <post-list :list="list"></post-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router' // 获取路由信息
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'
export default defineComponent({
  components: {
    PostList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentId = +route.params.id // +可以便捷地将string格式的id转换为number格式
    const column = computed(() => store.state.columns.find(c => c.id === currentId))
    const list = computed(() => store.state.posts.filter(post => post.id === currentId))
    return {
      column,
      list
    }
  }
})
</script>
