<template>
<teleport to="#back">
  <div
    class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
    :style="{backgroundColor: background || ''}"
  >
    <div class="loading-content">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ text || 'loading'}}</span>
      </div>
      <p v-if="text" class="text-primary small">{{text}}</p>
    </div>
  </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup() {
    const node = document.createElement('div') // setup在页面挂载之前先实现，在这个阶段创建一个div标签添加在body上，以提升加载蒙版的作用域到最顶层，而用teleport需要在index上添加div标签，不够优雅
    node.id = 'back'
    document.body.appendChild(node)
    onUnmounted(() => {
      document.body.removeChild(node) // 在Loader组件生命周期结束（后端成功返回数据,isLoading置为0时）后删除掉此节点
    })
  }
})
</script>

<style>
.loading-container {
  background: rgba(255, 255, 255, .5);
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
</style>
