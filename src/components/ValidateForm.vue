<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
type Events = {
  'form-item-created': ValidateFunc
}
export const emitter = mitt<Events>()
export default defineComponent({
  emits: ['form-submit'], // 如果没有事件的验证可以使用数组来定义而非对象
  setup(props, context) {
    let funcArr: ValidateFunc[] = [] // 创建一个数组用来存放函数
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result) // 循环调用遍历验证是否满足所传过来的函数validateInput中的每个条件并返回所有结果的布尔值，若有一个为false则整个返回false
      context.emit('form-submit', result)
    }
    const callback = (func: ValidateFunc) => { // 监听事件的回调函数的作用，是将子组件传过来的验证函数存放到funcArr中
      funcArr.push(func)
    }
    emitter.on('form-item-created', callback) // 给已经实例化的监听器emitter添加on事件名称及调用函数
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>

<style>

</style>
