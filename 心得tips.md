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

```html5
<slot name="center">这里可以填写默认值，当组件使用者没有进行填充时，center会显示</slot>
```

使用具名插槽
需要使用< template ></ template >包裹住填充的内容

```html5
<template v-slot:center>
    <!--此处可简写为 <template #center> -->
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

# 第六章 请你吃全家桶 - 初步使用 vue-router 和 vuex

## 6-1 什么是 SPA 应用？

**HTML5 History API： https://developer.mozilla.org/zh-CN/docs/Web/API/History_API**

这个 API 帮助我们可以在不刷新页面的前提下动态改变浏览器地址栏中的URL地址，动态修改页面上所显示资源。

** history.pushState(state, title, url) 方法 ：添加一条历史记录，不刷新页面参数 **

- state : 一个于指定网址相关的状态对象，popstate事件触发时，该对象会传入回调函数中。如果不需要这个对象，此处可以填null。
- title : 新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填null。
- url : 新的网址，必须与前页面处在同一个域。浏览器的地址栏将显示这个网址。

使用 history API 做的小例子地址： https://codesandbox.io/s/gallant-newton-kl9hj?file=/src/index.js

```javascript
const handleChange = (url, content) => {
  // go to url
  window.history.pushState(null, "hello there", url);

  // new data
  document.getElementById("app").innerHTML = `
    <h1>${content}</h1>
  `;
};
document.getElementById("change").addEventListener("click", e => {
  e.preventDefault();
  handleChange("create.html", "create");
});

document.getElementById("home").addEventListener("click", e => {
  e.preventDefault();
  handleChange("/", "home");
});
```

### SPA 的优点

- 速度快，第一次下载完成静态文件，跳转不需要再次下载静态文件
- 体验好，整个交互趋于无缝，更倾向于原生应用
- 为前后端分离提供了实践场所

## 6-2 Vue Router 的安装和使用

安装新版的 vue router

```bash
npm install vue-router@next

// 保证安装完毕的版本是 4.0.0 以上的
```

vue-router-next的项目地址： https://github.com/vuejs/vue-router-next

## 6-3 vue-router 添加路由

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
```

## 6-4 使用 vue-router 获取参数和跳转路由

Node.js URL 结构表地址：https://nodejs.org/api/url.html#url_url_strings_and_url_objects

```javascript
import { useRoute } from 'vue-router'
// 它是一个函数，调用后可以返回对应的对象。
const route = useRoute() 
// 我们返回出去，在页面中把它全部显示出来看看
return {
 route
}
// 对于一个object，如果我们想再页面显示它的全部内容，除了在 js 中使用 console，也可以使用 pre 标签包裹这个变量。
// pre 标签可定义预格式化的文本。在pre元素中的文本会保留空格和换行符。文本显现为等宽字体
<pre>{{route}}</pre>

// 替换 URL 为比较丰富的地址
http://localhost:8080/column?abc=foo#123
```

**router-link 组件跳转的方式**

我们第一种方法可以将 to 改成不是字符串类型，而是 object 类型，这个object 应该有你要前往route 的 name ，还有对应的 params。

```javascript
 :to="{ name: 'column', params: { id: column.id }}"
```

第二种格式，我们可以在里面传递一个模版字符串，这里面把 column.id 填充进去就好。

```javascript
 :to="`/column/${column.id}`"
```

**使用 useRouter 钩子函数进行跳转**

```javascript
const router = useRouter()
// 特别注意这个是 useRouter 而不是 useRoute，差一个字母，作用千差万别，那个是获得路由信息，这个是定义路由的一系列行为。在这里，我们可以调用
router.push('/login') 

// router.push 方法跳转到另外一个 url，它接受的参数和 router-link 的 to 里面的参数是完全一致的，其实router link 内部和这个 router 分享的是一段代码，可谓是殊途同归了。
```

### 关于router.push的说明

在Vue2.0路由跳转中，除了使用 <router-link> 创建 a 标签来定义导航链接，我们还可以借助 router 实例方法，通过编写代码来实现。

```vue
router.push(location)
```

想要导航到不同的 URL，使用 router.push 方法。这个方法会向 history 栈添加一个新记录，所以，当用户点击浏览器后退按钮时，可以返回到之前的 URL。

当你点击 <router-link> 时， router.push 方法会在内部调用，所以说，点击<router-link :to="..."> 等同于调用 router.push(...)。

```vue
声明式：<router-link :to="...">
编程式：router.push(...)
```

```vue
<!-- router.push(...)方法 -->
// 字符串
router.push('apple')
// 对象
router.push({path:'apple'})
// 命名路由
router.push({name: 'applename'})
//直接路由带查询参数query，地址栏变成 /apple?color=red
router.push({path: 'apple', query: {color: 'red' }})
//命名路由带查询参数query，地址栏变成/apple?color=red
router.push({name: 'applename', query: {color: 'red' }})
//直接路由带路由参数params，params 不生效，如果提供了 path，params 会被忽略
router.push({path:'applename', params:{ color: 'red' }})
// 命名路由带路由参数params，地址栏是/apple/red
router.push({name:'applename', params:{ color: 'red' }})

<!-- router-link :to="..."方法 -->
// 字符串
<router-link to="apple"> to apple</router-link>
// 对象
<router-link :to="{path:'apple'}"> to apple</router-link>
// 命名路由
<router-link :to="{name: 'applename'}"> to apple</router-link>
//直接路由带查询参数query，地址栏变成 /apple?color=red
<router-link :to="{path: 'apple', query: {color: 'red' }}"> to apple</router-link>
// 命名路由带查询参数query，地址栏变成/apple?color=red
<router-link :to="{name: 'applename', query: {color: 'red' }}"> to apple</router-link>
//直接路由带路由参数params，params 不生效，如果提供了 path，params 会被忽略
<router-link :to="{path: 'apple', params: { color: 'red' }}"> to apple</router-link>
// 命名路由带路由参数params，地址栏是/apple/red
<router-link :to="{name: 'applename', params: { color: 'red' }}"> to apple</router-link>
```

该方法的参数可以是一个字符串路径，或者一个描述地址的对象。

## 6-5关于添加的页面和路由视图的说明

![image-20220905164653175](C:\Users\Chenpengyu\AppData\Roaming\Typora\typora-user-images\image-20220905164653175.png)

## 6-6 什么是状态管理工具

### 直接使用全局对象的问题

- 第一，全局对象里面的数据是普通的 javascript 数据类型，他们不是响应式的，也就说第一次读取渲染有可能没有问题，但是当数据修改以后，界面没法作出对应的更新，这是一个很大的问题。
- 第二，全局对象的修改无法追踪，也就是说在应用中的任何一处代码，都可以有机会拿到全局数据，并作出对应的修改，但是我们根本没有办法搞清楚是哪行代码 哪个文件修改了全局数据，这样就非常容易产生 bug 而且难以追踪。这就很危险了。
- 第三，vue 是组件化的世界，就像我们的程序大家也可以发现，组件的构成就像一棵树一样，全局数据一般是从父组件一层层的传递给子组件的。直接从一个组件获取数据被视为一种反模式，这样很容易造成数据的混乱。

### 状态管理三杰

- Vuex ：https://vuex.vuejs.org/zh/guide/
- Redux ：https://redux.js.org/
- Mobx ：https://mobx.js.org/README.html

### 设计理念

- 一个类似 object 的全局数据结构 - 称之为 store
- 只能调用特定的方法完成数据的修改

## 6-7 Vuex 简介和安装

**每一个 Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。** Vuex 和单纯的全局对象有以下两点不同：

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

### 新版 Vuex 安装

```bash
npm install vuex@next --save

// 保证安装完毕的版本是 4.0.0 以上的
```

### 测试 Vuex store

```typescript
import { createStore } from 'vuex'
// 从 vuex 导入 createStore 这个函数，我们发现 vue3 以后，这些第三方的官方库，名字出奇的相似，vue-router 也是以create 开头的，看起来非常的清楚。
const store = createStore({
  state: {
    count: 0
  },  
})
// createStore 接受一个对象作为参数，这些对象中包含了 vuex 的核型概念，第一个概念称之为 state，这里面包含的是我们想放入的在全局共享的数据，这里我们放入一个简单的 count。

// 现在我们已经可以直接访问这个值了，我们可以直接使用 store.state.count 来访问它。

console.log('store', store.state.count)
// 接下来我们来更改状态，更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：
  mutations: {
    add (state) {
      state.count++
    }
  }
  
// 有了 mutations 以后，让我们来触发它，要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：
store.commit('add')
console.log('count', store.state.count)
```

## 6-8 Vuex 整合当前应用

**定义 store 文件**

```typescript
import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: false }
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'viking' }
    }
  }
})

export default store
```

**使用**

```typescript
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'

...
const store = useStore<GlobalDataProps>()
const list = computed(() => store.state.columns)
```

## 6-9 Vuex getters

vuex getters 文档 ：https://vuex.vuejs.org/zh/guide/getters.html

Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

```typescript
getters: {
  biggerColumnsLen(state) {
    return state.columns.filter(c => c.id > 2).length
  }
}
// 定义完毕，就可以在应用中使用这个 getter 了
// Getter 会暴露为 store.getters 对象，你可以以属性的形式访问这些值：
const biggerColumnsLen =computed(()=>store.getters.biggerColumnsLen)
getColumnById: (state) => (id: number) => {
  return state.columns.find(c => c.id === id)
},
getPostsByCid: (state) => (id: number) => {
  return state.posts.filter(post => post.columnId === id)
}
// 定义完毕以后就可以在应用中使用 getter 快速的拿到这两个值了
const column = computed(() => store.getters.getColumnById(currentId))
const list = computed(() => store.getters.getPostsByCid(currentId))
```

## 6-10 添加新建文章页面

当前应用的结构示意图

![image-20220906152045970](C:\Users\Chenpengyu\AppData\Roaming\Typora\typora-user-images\image-20220906152045970.png)

post使用columnId来表明自身属于哪个column，因此新建post需要columnId，每个专栏都有一个对应的作者author，与用户登录信息是同一个数据结构，所以新建文章时可以从当前登录用户的信息中拿到columnId，然后创建文章

## 6-11 添加导航守卫

vue-router 导航守卫文档 ：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html

```typescript
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !store.state.user.isLogin) {
    next({ name: 'login' })
  } else {
    next()
  }
})
```

## 6-12 添加元信息完成权限管理

vue-router 元信息文档 ：https://router.vuejs.org/zh/guide/advanced/meta.html

**添加元信息**

```typescript
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
```

**更新路由守卫**

```typescript
router.beforeEach((to, from, next) => {
  console.log(to.meta)
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/')
  } else {
    next()
  }
})
```

# 第7章 前后端结合 - 项目整合后端接口

## 7-2 RESTful API 设计理念

[https://en.wikipedia.org/wiki/Representational_state_transfer](RESTful API)是目前比较成熟的一套互联网应用程序的API设计理论。 **Endpoint**

> 在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。

```text
https://api.examples.com/teams
https://api.examples.com/players
```

**Verb 动词**

- GET（SELECT）：从服务器取出资源（一项或多项）
- POST（CREATE）：在服务器新建一个资源
- PUT（UPDATE）：在服务器更新资源
- PATCH（UPDATE）：在服务器更新资源
- DELETE（DELETE）：从服务器删除资源

**举例**

```text
// endpoints
https://api.example.com/teams
https://api.example.com/players


// verbs
GET /teams：列出所有球队
POST /teams：新建一个球队
GET /teams/ID：获取某个球队的信息
PUT /teams/ID：更新某个球队的信息（提供球队的全部信息）
PATCH /teams/ID：更新某个球队的信息（提供球队的部分信息）
{
  name: 'new team name'
}
DELETE /teams/ID：删除某个球队


// 复杂结构 一对多
GET /teams/ID/players：列出某个指定球队的所有球员


// 常见状态码
200 OK - [GET]：服务器成功返回用户请求的数据
201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
204 NO CONTENT - [DELETE]：用户删除数据成功。
401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作。

// 项目使用的 endpoints
GET /columns：列出所有专栏
GET /columns/ID：列出某个专栏的信息
GET /columns/ID/posts：列出某个专栏的所有文章
POST /columns/ID/posts 在某个专栏创建文章(需要权限)
GET /posts/ID: 列出某个文章的信息
POST /users/login 用户登录
GET /users/current 获取当前用户登录信息(需要权限)
```

## 7-3 使用 swagger在线文档查看接口详情

**接口文档需要包括的点**

- 第一 endponits，是具体的路径，或者说是网址。
- 第二 使用什么样的 method，get，post，put，patch 或者 delete
- 第三 发送请求要有什么样的参数，参数是在 url 上的 query还是 body 里面的复杂信息。
- 第四 请求返回的格式是什么样的。

**如果使用文档，有可能是这样的**

```text
### endpoints 
GET /teams/${ID}/players

### parameters
{
  name: 'ID',
  desc: '当前球队的 ID',
  type: 'string'
}

### responses
**200响应**

  {
    "code": 0,
    "data": [
      {
        "createdAt": "2020-06-05 16:45:22",
        "description": "有一段非常有意思的简介，可以更新一下欧",
        "name": "洛杉矶湖人",
        "_id": "5eda0622acb0d2280c10385e"
      },
      {
        "createdAt": "2020-06-05 16:45:22",
        "description": "有一段非常有意思的简介，可以更新一下欧",
        "name": "金州勇士",
        "_id": "5eda0544ce65c327d718e57b"
      }
    ],
    "msg": "请求成功"
  }

**401响应**
```

**文档地址：(http://api.vikingship.xyz/)[http://api.vikingship.xyz/] 基于 (swagger)[https://swagger.io/]**

## 7-4 axios 的基本用法和独家后端API 使用（必看） 7-5 后端Icode终极使用方案

地址：https://coding.imooc.com/lesson/449.html#mid=39379

慕课网提供的 Icode 经过几次升级，现在把最终的解决方案整理如下，供同学们参考。 可以在 main.ts 中的拦截器里面一劳永逸的添加。

```typescript
// 替换 baseURL
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 下面的 icode 值是从慕课网获取的 token 值，可以在课程右侧的项目接口校验码找到
axios.interceptors.request.use(config => {
  ... 其他代码
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: '******' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '******')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '******' }
  }
  return config
})
```

## 7-6 使用vuex action 发送异步请求

官方文档地址：https://vuex.vuejs.org/zh/guide/actions.html

mutations不支持异步请求，必须是同步函数。

Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态，可以包含任意的异步操作 。
- Action 可以包含任意异步操作。

在Vuex中，mutations用于同步事务，Action用于异步事务

相应的，其调用方法commit和dispatch也有所区别

- dispatch推送一个action。
- dispatch 异步操作 this.store.dispatch('action的方法',arg)，调用actions里的方法。
- commit同步操作this.store.commit('mutations的方法', arg)，调用mutations里的方法。

代码提交地址：https://git.imooc.com/coding-449/zheye/commit/216aa26136b6e4b6139a8806926b1d692c736dbd

## 7-7 使用vuex action 发送异步请求第二部分

代码提交地址：https://git.imooc.com/coding-449/zheye/commit/29922e606f0b58d6e77436e0032f42aa44bfebc6

## 7-8 使用 async 和 await 改造异步请求

**async 和 await 是基基于promises的语法糖，使异步代码更易于编写和阅读。通过使用它们，异步代码看起来更像是老式同步代码，因此它们非常值得学习。**

文档地址：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

代码示例:

```javascript
// 例一
function hello() { return "Hello" };
hello();

async function hello() { return "Hello" };
hello();

hello().then((value) => console.log(value))

// 例二
async function hello() {
  const greeting = await Promise.resolve("Hello");
  return greeting
};

hello().then((value) => console.log(value));
```

代码提交地址：https://git.imooc.com/coding-449/zheye/commit/e2c40255bfe4d5aa24f0211f0660302026df3171

## 7-9 使用axios拦截器添加loading效果

Axios 拦截器文档地址:https://axios-http.com/docs/interceptors

```typescript
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})


axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
})
```

### tips 关于axios拦截多次请求的问题

如果axios设置全局拦截请求，如果当前页面同时有多个请求发起则可能会展示不稳定。

**解决：**假如有多个请求的逻辑 要做的比较完美的话 可以添加一个计数器，每有一个 loading，给数目 加 1，每个请求完成给数目 减 1，最后假如等于零那么就是全部请求结束

## 7-10 7-11 Loader 组件编码

Bootstrap 提供的 Spinner：https://getbootstrap.com/docs/5.1/components/spinners/

Loader 第一部分编码地址:https://git.imooc.com/coding-449/zheye/commit/cd8a22fbaf8dd36ada4caaed880394603740edd2

Vue3 关于 Teleport 的官方文档：https://vuejs.org/guide/built-ins/teleport.html#basic-usage

Loader 第二部分编码地址:https://git.imooc.com/coding-449/zheye/commit/68b44a920a0b62d10f645cda0f013577f50eac55

### tips loader组件实例对象作用提升的问题

当第一节添加完loader组件后，发现loader的结构体在div之内，不够雅观，为了将作用域提升到body，首先想到的是teleport to，但此方法需要用户在index页面上手动添加一个div结构，如果将loader作为一个开源组件来讲，显得极不优雅，因此想到利用生命周期中setup的在页面挂载之前就先调用完毕，所以在loader组件中的setup函数中利用createElement+appendChild并在最后onUnmonuted移除该div元素的方法来实现。

# 第8章 通行凭证 - 权限管理

## 8-1 登录第一部分 获取token

代码提交详情：https://git.imooc.com/coding-449/zheye/commit/9d1623642c664693a08cdb460b43a1cb07a0618c

## 8-2 JWT 的运行机制

**JWT 以及 Session 的运行原理图** ![JWT 以及 Session 的运行原理图](http://docs.vikingship.xyz/assets/img/jwt.01794d6f.png)

JWT 的官方网站，可以去试试看:https://jwt.io/

## 8-3 登录第二部分 axios 设置通用 header

Axios Default Header 设置的文档:https://axios-http.com/docs/config_defaults

```javascript
// 示例代码
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

代码提交详情:https://git.imooc.com/coding-449/zheye/commit/329405426a98a88b318291fb62b477c4757bd6a6

## 8-4 登录第三部分 持久化登录状态

LocalStorage 文档地址:https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

注意这里为什么不选择 Cookie？

代码提交详情:https://git.imooc.com/coding-449/zheye/commit/d19af252da94f16f057c24e526c03f5ec29d1dca

## 8-5 通用错误处理

Axios 拦截器的文档地址:https://axios-http.com/docs/interceptors

示例代码:

```javascript
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
```

代码提交详情: https://git.imooc.com/coding-449/zheye/commit/d55345cee5af5c80557650fa490974a2fd313824

## 8-6 创建 Message 组件 8-7 Message 组件改进为函数调用形式

代码提交详情:https://git.imooc.com/coding-449/zheye/commit/9d5e0af1f28271bbabcdda50a3897484df77712b

关于 Vue createApp 实例相关的文档地址:https://v3.cn.vuejs.org/api/application-api.html#component

## 8-8 了解 Vnode 以及 vue 的简单工作原理

文档地址：https://vuejs.org/guide/extras/rendering-mechanism.html#virtual-dom

**Virtual DOM：一种虚拟的，保存在内存中的数据结构，用来代表 UI 的表现**，和真实 DOM 节点保持同步。Virtual DOM是由一系列的 Vnode 组成的。

```javascript
// 模拟一个简单的 Vnode
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* more vnodes */
  ]
}
```

#### Render Pipeline

- **Compile**， Vue 组件的 Template 会被编译成 **render function**，一个可以返回 Virtual DOM 树的函数。
- **Mount**，执行 render function，遍历虚拟DOM 树，生成真正的 DOM 节点。
- **Patch**，当组件中任何响应式对象（依赖）发生变化的时候，执行更新操作 。生成新的虚拟节点树，Vue 内部会遍历新的虚拟节点树，和旧的树做对比，然后执行**必要**的更新。

![img](http://docs.vikingship.xyz/assets/img/pipeline.b75c5864.png)

**虚拟DOM 的优点**

- 可以使用一种更方便的方式，供开发者操控 UI 的状态和结构，不必和真实的DOM 节点打交道。
- 更新效率更高，计算需要的最小化操作，并完成更新。

#### 看一下 Render Functions

```javascript
// 在 main.ts 中
console.log(App)
// 返回
Object
  components: {HelloWorld: {…}}
  name: "App"
  render: ƒ render(_ctx, _cache, $props, $setup, $data, $options)
  setup: ƒ ()
// 原始的 template
<template>
  <HelloWorld msg="axyz"/>
  {{ hello }}
</template>

// template 会被转换成这样的 function
  const _component_HelloWorld = _resolveComponent("HelloWorld")!

  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createVNode(_component_HelloWorld, { msg: "axyz" }),
    _createTextVNode(" " + _toDisplayString(_ctx.hello), 1 /* TEXT */)
  ], 64 /* STABLE_FRAGMENT */))
```

- Template 比 render function 更接近 html，更好懂，更容易修改。
- Template 更容易做静态优化，Vue 的 compiler 在编译过程中可以做很多自动的性能优化。

在实践中，templates适应大多数的情况，但是在少数情况下，还是需要学习使用 render function。因为它本身是 javascript 语法，要更灵活多变。Vue 提供对应的 API 可以不使用 templates，而是直接使用 render function。

## 8-9 创建 Vnode 以及使用 render function

#### [#](http://docs.vikingship.xyz/auth.html#创建-vnode)创建 Vnode

**h 和 createVnode** 都可以创建 vnode，h 是 hyperscript 的缩写，意思就是 “JavaScript that produces HTML (hypertext markup language)”，很多 virtualDOM 的实现都使用这个函数名称。还有一个函数称之为 createVnode，更形象，两个函数的用法几乎是一样的。

```javascript
import { h, createVnode } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```

#### 声明 Render Function

当使用 composition API 的时候，在 setup 当中直接返回一个对象，代表着给模版使用的数据，当要使用 render function 的时候，可以直接返回一个函数。

```javascript
setup() {
  const message = ref(1)
  // 使用 template
  return {
    message
  }
  // 使用 render function
  return () => {
    return h('div')
  }
}
```

**使用 JSX**

JSX 是一种类似XML 的语法，如果大家使用过 React 对它应该特别熟悉。它就是 h 函数的一种语法糖。可以将这种类似 HTML 的语法转换成 h 函数的写法。

```jsx
// 创建 vnode
const vnode = <div>hello</div>
// 使用变量
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

添加 JSX 支持

```bash
vue add babel
```