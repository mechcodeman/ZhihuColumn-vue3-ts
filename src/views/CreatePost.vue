<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <uploader
      action="/upload"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <div class="d-flex">
        <div class="spinner-border text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    <template #loading>
      <div class="d-flex">
        <div class="spinner-border text-secondary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <h2>正在上传</h2>
      </div>
    </template>
    <template #uploaded="dataProps">
      <img :src="dataProps.uploadedData.data.url" alt="">
    </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
        rows="10"
          type="text"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <!-- 使用ValidateForm中的具名插槽创建一个提交按钮 -->
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { GlobalDataProps, PostProps } from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '@/components/Uploader.vue'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    const titleVal = ref('')
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column } = store.state.user
        if (column) { // typeguard，columnId定义时可能为undefinded导致下面的columnId类型判断报错
          const newPost: PostProps = {
            title: titleVal.value, // 获取通过v-model双向绑定的input输入框内容，下同
            content: contentVal.value,
            column
          }
          store.commit('createPost', newPost)
          router.push({ name: 'column', params: { id: column } }) // 命名路由创建成功后自动跳转到coulumnId（代表当前专栏作者）对应详情页
        }
      }
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
