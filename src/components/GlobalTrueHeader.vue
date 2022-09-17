<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">者也专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <drop-down :title="`你好 ${user.nickName}`">
          <dropdown-item><router-link to="/create" class="dropdown-item">新建文章</router-link></dropdown-item>
          <dropdown-item><router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link></dropdown-item>
          <dropdown-item disabled><a href="#" class="dropdown-item">编辑资料</a></dropdown-item>
          <dropdown-item><a href="#" @click="onLogout" class="dropdown-item">退出登录</a></dropdown-item>
        </drop-down>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DropDown from './DropDown.vue'
import DropdownItem from './DropdownItem.vue'
import store, { UserProps } from '../store'
import createMessage from './createMessage'
export default defineComponent({
  name: 'GlobalTrueHeader',
  components: { DropDown, DropdownItem },
  props: {
    user: {
      type: Object as PropType<UserProps>, // 通过自定义接口来限制传入参数的类型
      required: true
    }
  },
  setup() {
    const onLogout = () => {
      store.commit('logout')
      createMessage('退出登录成功', 'default', 2000)
    }
    return {
      onLogout
    }
  }
})
</script>

<style>

</style>
