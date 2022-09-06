<template>
  <div class="validate-input-container pb-3">
    <input
    v-if="tag !== 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
    >
    <textarea
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
    >
    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted } from 'vue'
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordReg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/
interface RuleProp {
  type: 'required' | 'email' | 'password' | 'min' | 'max';
  message: string;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea' // 创建一个新的类型用于支持input和textarea两种输入框
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modeValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input' // 默认为input输入框
    }
  },
  inheritAttrs: false,
  setup(props, context) {
    const inputRef = reactive({
      val: props.modeValue || '',
      error: false,
      message: ''
    })
    const updateValue = (e: Event) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'password':
              passed = passwordReg.test(inputRef.val)
              break
            case 'min':
              if (inputRef.val.trim().length > 6) {
                passed = true
              } else {
                passed = false
              }
              break
            case 'max':
              if (inputRef.val.trim().length < 17) {
                passed = true
              } else {
                passed = false
              }
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput) // 在子组件中给emitter添加同名触发事件，并传入参数
    })
    return {
      inputRef,
      validateInput,
      updateValue
    }
  }
})
</script>

<style>

</style>
