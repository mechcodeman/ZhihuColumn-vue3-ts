<template>
  <div class="row">
    <div v-for="column in columnList" :key="column.id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img :src="column.avatar" class="rounded-circle border border-light w-25 my-3" :alt="column.title">
          <h5 class="card-title">{{column.title}}</h5>
          <p class="card-text text-left">{{column.description}}</p>
          <!-- 通过动态路由来指定子组件ColumnList的实例对象被点击时跳转到对应的作者专栏中 -->
          <router-link :to="`/column/${column.id}`" class="btn btn-outline-primary">进入专栏</router-link>
          <!-- 在to前面加上: 表示动态路由，通过模板字符串或者传入对象的形式来指定动态路径 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
export interface ColumnProps {
  id: number;
  title: string;
  avatar?: string; // 设置无图像时的默认显示图标
  description: string;
}
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>, // 利用PropType给构造函数Array添加自定义泛型的类型断言
      required: true
    }
  },
  setup(props) {
    const columnList = computed(() => {
      return props.list.map(column => { // 根据动态路由来查找测试数据中对应的专栏作者信息并返回到子组件实例对象上进行渲染
        if (!column.avatar) {
          column.avatar = require('@/assets/column.jpg')
        }
        return column
      })
    })
    return { columnList }
  }
})
</script>

<style>

</style>
