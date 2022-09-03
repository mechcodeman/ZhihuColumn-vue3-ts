# 第四章 项目起航 - 准备工作和第一个页面

## 4-1 项目起航 需求分析

**一个复杂的 SPA 项目都要包括哪些知识点？**

- 第一，要有数据的展示，这个是所有网站共有的特性，而且最好是有多级复杂数据的展示
- 第二，要有数据的创建，这就是表单的作用，有展示自然要有创建。在创建中，我们会发散很多问题，比如数据的验证怎样做，文件的上传如何处理，创建和编辑怎样共享单个页面等等。
- 第三，要有组件的抽象，vue 是组件的世界，组件是最重要的一环，编写组件是最基本的能力，对于一些常用的功能，我们需要高可用性和可定制性的组件，也就是说我们在整个项目中一般不会用到第三方组件，比如 element，都是从零开始，而且会循序渐进，不断抽象。甚至行成自己的一套小组件库。
- 第四，整体状态数据结构的设计和实现，SPA 一般使用状态工具管理整理状态，并且给多个路由使用，在 vue 中，我们使用 vuex，一个项目的整体数据结构的复杂程度就代表了这个能力的高低，最好是要有多层次的数据结构，相互依赖的关系，还要将数据的获取，结构设计，缓存进行一系列的考量。
- 第五，权限管理和控制，一个项目需要有用户权限的实现，不仅仅是后端，前端作为一个整体的 SPA 的项目，权限控制也尤为重要，我们需要有权限的获取，权限的持久化，权限的更新，那个路由可访问，哪个需要权限才可以访问。发送异步请求的全局 token 注入，全局拦截，全局信息提示等等和权限相关的内容。
- 第六，真实的后端API，和后端的交互是整个项目的最重要一环。一些同学在开发项目的时候会使用 mock server，但是由于后端的数据结构常常和最初的文档设计背道而驰，造成最后项目需要再次回炉修改。

**页面所有原型图地址**: https://whimsical.com/Djb2TcWsLTPeapFdM3NaX

## 4-2 文件结构和代码规范

创建项目的过程和之前 vue3 基础知识的过程完全一致

[配置 vue3 开发环境](http://docs.vikingship.xyz/vue3-basic/)

唯一区别就是在步骤

**Pick a linter / formatter config** - 我们选择了 **ESLint + Standard config**

区别就是我们额外添加了 Standard 代码规范。https://standardjs.com/readme-zhcn.html

**我们初步确定的项目文件结构**

```bash
/assets
	image.png
    logo.png
        	
/components
	ColumnList.vue
    Dropdown.vue
    ...
/hooks
	useURLloader.ts
    ...
/views
	Home.vue
    ...
App.vue
main.ts
store.ts
router.ts
...
```

## 4-3 从好用的样式库开始

安装最新版的 Bootstrap

```bash
npm install bootstrap@next --save
```

TIP

注意安装完毕应该至少是 v5.0.0-alpha1 以上版本

Bootstrap V5 文档地址： https://v5.getbootstrap.com/

## 4-4 ColumnList 组件编码

**ColumnList 组件源代码**

```vue
<template>
  <ul>
    <li v-for="column in list" :key="column.id">
      <img :src="column.avatar" :alt="column.title">
      <h5>{{column.title}}</h5>
      <p>{{column.description}}</p>
      <a href="#">进入专栏</a>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export interface ColumnProps {
  id: number;
  title: string;
  avatar: string;
  description: string;
}
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      //这里特别有一点，我们现在的 Array 是没有类型的，只是一个数组，我们希望它是一个 ColomnProps 的数组，那么我们是否可以使用了类型断言直接写成 ColomnProps[]，显然是不行的 ，因为 Array 是一个数组的构造函数不是类型，我们可以使用 PropType 这个方法，它接受一个泛型，讲 Array 构造函数返回传入的泛型类型。
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  }
})
</script>
```

**引入 bootstrap**

```javascript
import 'bootstrap/dist/css/bootstrap.min.css'
```

**测试数据**

```javascript
const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  }
]
```

## 4-5 ColumnList 组件使用 Bootstrap 美化

**Bootstrap 栅格系统文档地址： https://v5.getbootstrap.com/docs/5.0/layout/grid/**

**Bootstrap card 样式文档地址： https://v5.getbootstrap.com/docs/5.0/components/card/**

设置默认的 avatar 图片

```javascript
  setup(props) {
    const columnList = computed(() => {
      return props.list.map(column => {
        if (!column.avatar) {
          column.avatar = require('@/assets/column.jpg')
        }
        return column
      })
    })
    return {
      columnList
    }
  }
```

修改后的vue template 模版

```html
  <div class="row">
    <div v-for="column in columnList" :key="column.id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img  :src="column.avatar" :alt="column.title" class="rounded-circle border border-light w-25 my-3" >
          <h5 class="card-title">{{column.title}}</h5>
          <p class="card-text text-left">{{column.description}}</p>
          <a href="#" class="btn btn-outline-primary">进入专栏</a>
        </div>
      </div>
    </div>
  </div>
```

设置当没有图片传入的时候的默认加载本地图片

组件中添加代码

```ts
setup(props) {
    const columnList = computed(() => {
      return props.list.map(column => { // 用map函数传入验证是否有图片的函数，若无则替换为本地默认加载图片，将结果返回到一个新的数组columnList中
        if (!column.avatar) {
          column.avatar = require('@/assets/column.jpg')
        }
        return column
      })
    })
    return { columnList }
  }
```



## 4-6 GlobalHeader 组件编码

**Bootstrap nav 样式文档地址： https://v5.getbootstrap.com/docs/5.0/components/navs/**

GlobalHeader 源代码

```vue
<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <a class="navbar-brand" href="#">者也专栏</a>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">登陆</a></li>
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">注册</a></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">你好 {{user.name}}</a></li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}
export default defineComponent({
  name: 'GlobalHeader',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  }
})
</script>
```

### tips：

1.子组件中props中type、required属性

```ts
export default defineComponent({
  name: 'GlobalHeader',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
    /** 这里的type是设置传递过来属性值的类型，如果没加type，那么无论propB是什么数据类型都会显示,
		且程序不会报错，但是如果加了type，例如现在的type:Array,就是说传递过来的属性值的数据类型必须为数组，
		不然会报错。当然了，这里就算会报错，但是该显示的数据依旧会显示，不过就是有报错。当然这里type的值可以有多个，
		例如type:[Array,Object],这样就是说你传入值的数据类型可以是对象也可以是数组 **/
	/** 这里的requires是必加属性，例如，我们这里加入了required:true。就是说这里的propB必须要要给属性值。也就是父组件挂		载子组件时必须在子组件标签中写入传入数据 **/
  }
})
```

2.子组件GlobalHeader命名导致的未知异常错误，致使代码无法编译，更名后即可正常运行

## 4-7 Dropdown 组件编码第一部分 - 基本功能

**Bootstrap dropdown 样式文档地址： https://v5.getbootstrap.com/docs/5.0/components/dropdowns/**

Dropdown 组件编码

```vue
<template>
<div class="dropdown">
  <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
    {{title}}
  </a>
  <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
    <li class="dropdown-item">
      <a href="#">新建文章</a>
    </li>
    <li class="dropdown-item">
      <a href="#">编辑资料</a>
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const isOpen = ref(false)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    return {
      isOpen,
      toggleOpen
    }
  }
})
</script>
```

## 4-8 Dropdown 组件编码第二部分 - 添加 DropdownItem

**Vue3 slot 文档地址： https://v3.vuejs.org/guide/component-slots.html#slots**

分离出来的 DropdownItem 组件编码

```vue
<template>
  <li
    class="dropdown-option"
    :class="{'is-disabled': disabled}"
  >
    <!-- 插槽用于插入a链接实现点击跳转功能 -->
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style>
.dropdown-option.is-disabled * {
  color: #6c757d;
  pointer-events: none;
  background-color: transparent;
}
</style>
```

对dropdown组件进行修改

```ts
<template>
  <div class="dropdown">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
      {{title}}
    </a>
    <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
    <!-- 插槽用于存放自定义的dropdownitem组件 -->
    <slot></slot>
  </ul>
  </div>
</template>
```



### tips：vue动态绑定class的几种方法

一、对象语法

1、给v-bind:class 设置一个对象，可以动态地切换class，例如：

```ts
<div id="app">
    <div :class="{'active':isActive}"></div>
</div>
<script>
var app = new Vue({
    el:'#app',
    data:{
        isActive:true
    }
})
</script>

```

最终渲染结果： <div class="active"></div>

2、对象中也可存在多个属性，动态切换class，：class 可以合class共存

```ts
<div id="app">
    <div class="static" :class="{'active':isActive,'error':isError}"></div>
</div>
<script>
var app = new Vue({
    el:'#app',
    data:{
        isActive:true,
        isError:false
    }
})
</script>
```

最终渲染结果：`<div class="static active"></div>`

3、当:class的表达式过长或逻辑复杂时，可以绑定一个计算属性，一般当条件多于两个时，都可以使用data或者computed

```ts
<div id="app">
    <div :class="classes"></div>
</div>
<script>
var app = new Vue({
    el:'#app',
    data:{
        isActive:true,
        isError:null
    },
    computed:{
        classes(){
            return {
                active:this.isActive && !this.error,
                'text-fail':this.error && this.error.type ==='fail'
            }
        }
    }
})
</script>

```

二、数组语法

1、当需要应用多个class时，可以使用数组语法，给:class绑定一个数组，应用一个class列表：

```ts
<div id="app">
    <div :class="[atvieCls,errorCls]"></div>
</div>
<script>
var app = new Vue({
    el:'#app',
    data:{
        atvieCls:'active',
        errorCls:'error'
    }
})
</script>

```

最后渲染的结果：<div class="active error"></div>

2、使用三元表达式，根据条件切换class（当数据isActive为真时，样式active才会被应用）

```ts
<div id="app">
    <div :class="[isActive ? activeCls : '',errorCls]"></div>
</div>
<script>
var app = new Vue({
    el:'#app',
    data:{
        isActive:true,
        atvieCls:'active',
        errorCls:'error'
    }
})
</script>

```

渲染的结果为：<div class="active error"></div>

3、class有多个条件时，这样写较为烦琐，可以在数组语法中使用对象语法：

```ts
<div id="app">
    <div :class="[{'active':isActive},errorCls]"></div>
</div>
<script>
var app = new Vue({
    el:'#app',
    data:{
        isActive:true,
        errorCls:'error'
    }
})
</script>

```

渲染的结果为：<div class="active error"></div>

4、与对象语法一样，也可以使用data、computed、method三种方法，以计算属性为例：

```ts
<div id="app">
    <button :class="classes"></button>
</div>
<script>
    var app = new Vue({
        el: '#app',
        data: {
            size: 'large',
            disabled: true
        },
        computed: {
            classes: function () {
                return [
                    'btn',
                    {
                        ['btn-'+this.size]: this.size!=='',
                        ['btn-disabled']: this.disabled,
                    }
                ]
            }
        }
    })
</script>

```

最后渲染结果：<div class="btn btn-large btn-disabled"></div>

三、在组件上使用

如果直接在自定义组件上使用class或:class，样式规则会直接应用到这个组件的根元素上，例如声明一个简单的组件：

```ts
<script>
    Vue.component('my-component', {
        template: '<p class="article">一些文本</p>'
    })
</script>

```

```ts
<div id="app">
    <my-component :class="'active':isActive"></my-component>
</div>
<script>
    var app = new Vue({
        el: '#app',
        data: {
            isActive: true
        }
    })
</script>

```

最终组件渲染后的结果为：<p class="article active">一些文本</p>

## 4-9 Dropdown 组件编码第三部分 - 点击外部区域自动隐藏

**composition API 使用 template ref： https://v3.vuejs.org/guide/composition-api-template-refs.html#template-refs**

给模版添加 ref 属性

```html
<div class="dropdown" ref="dropdownRef">
    const dropdownRef = ref<null | HTMLElement>(null) // 保证与结构中的ref="dropdownRef"节点有相同名字，则可通过dropdownRef.value获取dom节点
    const handler = (e: MouseEvent) => {
      if (dropdownRef.value) {
        if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) { //验证点击的元素是否被下拉菜单栏包含，当不被包含切下拉菜单处于弹出状态时才会执行关闭菜单栏的操作
          isOpen.value = false
        }
      }
    }
    onMounted(() => {
      document.addEventListener('click', handler)
    })
    onUnmounted(() => {
      document.removeEventListener('click', handler)
    })
    return {
      isOpen,
      toggleOpen,
      // 返回和 ref 同名的响应式对象，就可以拿到对应的 dom 节点
      dropdownRef
    }
```

## 4-10 useClickOutside 第一个自定义函数

hooks函数代码块

```javascript
import { ref, onMounted, onUnmounted, Ref } from 'vue'

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

export default useClickOutside
```

在DropDown组件中对应内容修改为以下

```ts
export default defineComponent({
  name: 'DropDown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    const dropdownRef = ref<HTMLElement | null>(null)
    const isOpen = ref(false)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    const isClickOutside = useClickOutside(dropdownRef)
    watch(isClickOutside, () => { // 此处必须用watch进行监测，否则代码只会在setup的时候运行一次，不是响应式的
      if (isClickOutside.value && isOpen.value) {
        isOpen.value = false
      }
    })
    return {
      isOpen,
      toggleOpen,
      dropdownRef
    }
  }
})
```

**setup**是组合Composition API中的入口函数,也是第一个要使用的*函数*。 *setup只在初始化时执行一次*,所有的Composition API函数都在此使用。

### tips： 自定义函数中elementRef的解释

首先要搞清楚一个概念 课中讲的 template ref 的概念：https://vuejs.org/guide/essentials/template-refs.html

就是怎样获取一个 template 中的 DOM 节点。注意vue2和3在这里类似ref方法有所区别，因为setup函数导致

```ts
<script setup>
    import { ref, onMounted } from 'vue'
     
    // 创建一个 ref
    // 命名必须和 template 中ref 属性名称完全一样，比如说这里是 input，template 也是 input
    const input = ref(null)
     
    onMounted(() => {
    // 这样就可以拿到这个 DOM 节点了
        input.value.focus()
    })
</script>
 
<template>
    <input ref="input" />
</template>
```

所以：问题的回答：

1 elementRef.value 是对应需要判断点击是否在这个节点之外的DOM 节点

2 判断当前的点击位置，是否在这个节点之内，还是之外。

3 答案和1一样

# 第五章 表单的世界 - 完成自定义 Form 组件

## 5-1 web 世界的经典元素 - 表单

**需求分析** ![表单组件的序曲分析](http://docs.vikingship.xyz/assets/img/form1.b96476f2.png)

## 5-2 ValidateInput 编码第一部分 - 简单的实现

**Bootstrap Form文档地址： https://v5.getbootstrap.com/docs/5.0/forms/overview/**

```html
  <form action="">
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
      <input
        type="text" class="form-control" id="exampleInputEmail1"
        v-model="emailRef.val"
        @blur="validateEmail"
      >
      <div class="form-text" v-if="emailRef.error">{{emailRef.message}}</div>
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">密码</label>
      <input type="password" class="form-control" id="exampleInputPassword1">
    </div>
  </form>
```

验证表单的逻辑处理, 现在有两个规则，不能为空，和需要是邮件地址

```javascript
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

return {
  emailRef,
  validateEmail
}
```

## 5-3 ValidateInput 编码第二部分 - 抽象验证规则

ValidateInput 编码

```vue
<template>
  <div class="validate-input-container pb-3">
    <input type="text"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
    >
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
  type: 'required' | 'email';
  message: string;
}
export type RulesProp = RuleProp[]
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>
  },
  setup(props) {
    const inputRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const validateInput = () => {
      if (props.rules) {
        // 考虑到需要循环验证表单中的内容，并且每一项要求都需要通过，若有一项不符合则会弹出提示，因此想到用array的every方法，每次遍历通过则返回true并进行下一次循环，若不通过则返回false
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
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
      }
    }
    return {
      inputRef,
      validateInput
    }
  }
})
</script>
```

使用

```html
<div class="mb-3">
  <label class="form-label">邮箱地址</label>
  <validate-input :rules="emailRules"></validate-input>
</div>
const emailRules: RulesProp = [
  { type: 'required', message: '电子邮箱地址不能为空' },
  { type: 'email', message: '请输入正确的电子邮箱格式' }
]
```

## 5-4 ValidateInput 编码第三部分 - 支持 v-model

WARNING

这是一个 breaking change！ **Vue3 v-model 文档地址： https://v3.vuejs.org/guide/migration/v-model.html#overview**

```vue
<template>
  <div class="validate-input-container pb-3">
    <input type="text"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
    >
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>
<script lang="ts">
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String
  },
  const inputRef = reactive({
    val: props.modelValue || '',
    error: false,
    message: ''
  })
  const updateValue = (e: KeyboardEvent) => {
    const targetValue = (e.target as HTMLInputElement).value
    inputRef.val = targetValue
    context.emit('update:modelValue', targetValue)
  }

</script>
```

### tips：关于v-model

vue2中关于v-model的语法糖实现，参考下面这篇博客：[Vue2--v-model 的语法糖_Ljwen_的博客-CSDN博客_vue2组件v-model](https://blog.csdn.net/Ljwen_/article/details/125400803)

vue2中的v-model对于input和value方法和自定义名称非常易混淆，vue3中提出了v-model compile后的结果变为

```ts
<my-component v-model='foo' />
    h(Comp, {
    modelValue: foo,
    'onUpdate: modelValue': value => (foo = value)
}])
```

vue3中支持v-model，两个步骤来自定义组件

1. 创建一个名为modelValue: String的props属性
2. 更新值的时候需要发送一个事件，事件名称为update: modelValue

## 5-5 ValidateInput 编码第四部分 - 使用 $attrs 支持默认属性

**Vue3 $attrs 文档地址： https://v3.vuejs.org/api/instance-properties.html#attrs**

## 5-6 ValidateForm 组件需求分析

**需求分析** ![表单组件的序曲分析](http://docs.vikingship.xyz/assets/img/form2.ea475c4d.png)

## 5-7 ValidateForm 编码第一部分 - 使用插槽 slot

**Vue3 具名插槽 Named Slots 文档地址： https://v3.vuejs.org/guide/component-slots.html#named-slots**

ValidateForm.vue

```vue
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
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['form-submit'],
  setup(props, context) {
    const submitForm = () => {
      context.emit('form-submit', true)
    }
    return {
      submitForm
    }
  }
})
</script>
```

### tips：具名插槽v-slot: name及其简写形式#name

当我们需要多个插槽时，对于这种情况，< slot > 元素有一个特殊的 attribute：name。这个 attribute 可以用来定义额外的插槽。在我们前面插槽都没有使用name属性，它带有一个隐含的名字：default。即< slot ></ slot >等价于< slot name=“default”></ slot >

组件中定义具名插槽

```ts
<slot name="center">这里可以填写默认值，当组件使用者没有进行填充时，center会显示</slot>
```

使用具名插槽
需要使用< template ></ template >包裹住填充的内容

```ts
<template v-slot:center>
     <!--填充的内容-->
</template>
```

更多有关slot插槽用法请baidu

## 5-9 ValidateForm 编码第三部分 - 寻找外援 mitt 和 5-10 ValidateForm 编码第四部分 - 大功告成

### ！！！Most important！！！

这一部分非常难，需要反复观看理解视频，知道每一步背后的逻辑，下面是初次思考的结果。

难点在于，实现submit按钮点击时能调用ValidateInput组件中的验证函数validateInput来验证表单中每一项是否符合要求。那么为什么难呢，难在哪里呢？

先来看看ValidateInput和App组件通讯的例子，由于ValidateInput组件在App中有直接的实例化对象，因此可以通过给组件实例对象标签上添加ref="inputRef"，再在setup中添加const inputRef = ref<any>()，通过这种名称对应的方式，该ValidateInput子组件实例对象就被添加到了inputRef.value中，可以通过inputRef.value的方式直接获取到子组件ValidateInput上的所有方法（因此可以拿到目标验证函数validateInput）。

```html5
//此时App的结构
<template>
  <div class="container">
    <global-true-header :user="currentUser"></global-true-header>
    <!-- <column-list :list="list"></column-list> -->
  <validate-form @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <validate-input type="text" :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" ref="inputRef"></validate-input> // ValidateInput组件在App中有直接的实例化对象
    </div>
    <div class="mb-3">
      <label class="form-label">密码</label>
      <validate-input type="password" :rules="passwordRules" v-model="passwordVal" placeholder="请输入密码"></validate-input>
    </div>
    <template #submit>
      <span class="btn btn-danger">submit</span>
    </template>
  </validate-form>
  </div>
</template>
```

但是当情况到了ValidateForm来获取子组件ValidateInput中的目标函数validateInput时，我们发现在ValidateForm中加入Input子组件的方法是通过插槽slot来实现的，无法像App那样直接在对应子组件实例化对象上添加ref属性来获取子组件上的方法，因此引出了本节中最大的难点，如果实现二者之间的通信？

答案：通过事件监听器来完成

**事件监听器 mitt 文档地址： https://github.com/developit/mitt**

安装 mitt

```bash
npm install mitt --save
```

**ValidateForm.vue**

```javascript
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
// 实例化 mitt
export const emitter = mitt()
export default defineComponent({
  emits: ['form-submit'],
  setup(props, context) {
    let funcArr: ValidateFunc[] = []
    const submitForm = () => {
      // 循环执行数组 得到最后的验证结果
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    // 将监听得到的验证函数都存到一个数组中
    const callback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    // 添加监听
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      // 删除监听
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
```

**ValidateInput.vue**

```javascript
// 将事件发射出去，其实就是把验证函数发射出去
onMounted(() => {
  emitter.emit('form-item-created', validateInput)
})
```