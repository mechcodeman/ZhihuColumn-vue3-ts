<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change = "handleFileChange">
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, ref, PropType } from 'vue'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean;
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  inheritAttrs: false,
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null) // 假如我们要拿到模版里面的某个DOM节点，我们需要创建一个 ref，比如
    /* const node = ref()
      // 返回
      // 然后在模版上需要的节点上面加一个同名的 ref 属性
      // 所以这里的命名应该是 node，和变量名统一
        <div ref="node">
      // 这个时候就可以在 js 代码中拿到 DOM 节点了
    */
    const fileStatus = ref<UploadStatus>('ready')
    const uploadedData = ref()
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          fileStatus.value = 'success'
          uploadedData.value = resp.data
          context.emit('file-uploaded', resp.data)
        }).catch((error) => {
          fileStatus.value = 'error'
          context.emit('file-uploaded-error', { error })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      handleFileChange,
      uploadedData
    }
  }
})
</script>
