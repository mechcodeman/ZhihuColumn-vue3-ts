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
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <!-- 通过子组件渲染所有作者的专栏，其中信息list由testData.ts导入 -->
    <column-list :list="list"></column-list>
    <button
    class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
    @click="loadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store' // 在store.ts中定义的全局类型可以直接拿出来，也可以当作泛型传到useStore中，获得更好的自动补全
import useLoadMore from '../hooks/useLoadMore'
import ColumnList from '../components/ColumnList.vue'
export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const total = computed(() => store.state.columns.total)
    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 3 })
    })
    const list = computed(() => store.getters.getColumns)
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { pageSize: 3, currentPage: 2 })
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
