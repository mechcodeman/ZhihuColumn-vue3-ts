<template>
  <div class="home-page">
    <!-- 渲染Home作为主页所需要的内容格式 -->
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <uploader action="/upload"></uploader>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <!-- 通过子组件渲染所有作者的专栏，其中信息list由testData.ts导入 -->
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store' // 在store.ts中定义的全局类型可以直接拿出来，也可以当作泛型传到useStore中，获得更好的自动补全
import ColumnList from '../components/ColumnList.vue'
import Uploader from '../components/Uploader.vue'
export default defineComponent({
  name: 'Home',
  components: {
    ColumnList,
    Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    const list = computed(() => store.state.columns) // 利用computed属性方便地监听目标对象
    return {
      list
    }
  }
})
</script>
