<template>
  <h1>
    <pre>{{route}}</pre>
  </h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router' // 获取路由信息
export default defineComponent({
  setup() {
    const route = useRoute()
    return {
      route
    }
  }
})
</script>
