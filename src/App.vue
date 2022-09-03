<template>
  <div class="container">
    <global-true-header :user="currentUser"></global-true-header>
    <!-- <column-list :list="list"></column-list> -->
  <validate-form @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <validate-input type="text" :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" ref="inputRef"></validate-input>
    </div>
    <div class="mb-3">
      <label class="form-label align-left-start">密码</label>
      <validate-input type="password" :rules="passwordRules" v-model="passwordVal" placeholder="请输入密码"></validate-input>
    </div>
    <template #submit>
      <span class="btn btn-danger">submit</span>
    </template>
  </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalTrueHeader, { UserProps } from './components/GlobalTrueHeader.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'
import ValidateForm from './components/ValidateForm.vue'
const currentUser: UserProps = {
  isLogin: true,
  name: '宇宙大爹陈鹏宇'
}
const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1专栏',
    description: '这是一个测试的专栏,是用来测试的你好哈哈哈哈',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 2,
    title: 'test2专栏',
    description: '这是一个测试的专栏,是用来测试的你好哈哈哈哈',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 3,
    title: 'test3专栏',
    description: '这是一个测试的专栏,是用来测试的你好哈哈哈哈'
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 4,
    title: 'test4专栏',
    description: '这是一个测试的专栏,是用来测试的你好哈哈哈哈',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  }
]
const emailReg = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/
export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalTrueHeader,
    ValidateInput,
    ValidateForm
  },
  setup() {
    const inputRef = ref<any>()
    const emailVal = ref('123@test.com')
    const passwordVal = ref('132asds')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'password', message: '请输入正确的密码格式' },
      { type: 'min', message: '你的密码至少包括六位，不能含有空格' },
      { type: 'max', message: '你的密码最长不能超过十六位，不能含有空格' }
    ]
    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const validateEmail = () => {
      if (emailRef.val.trim() === '') {
        emailRef.error = true
        emailRef.message = 'can not be empty'
      } else if (!emailReg.test(emailRef.val)) {
        emailRef.error = true
        emailRef.message = 'should be valid email'
      }
    }
    const onFormSubmit = (result: boolean) => {
      console.log('result', result)
    }
    return {
      list: testData,
      currentUser,
      emailRef,
      validateEmail,
      ValidateInput,
      emailRules,
      passwordRules,
      emailVal,
      passwordVal,
      onFormSubmit,
      inputRef // 通过这一变量来实现与子组件ValidateInput的通讯，但由于表单中使用slot加入该组件，所以无法通讯，需要事件侦听器
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
