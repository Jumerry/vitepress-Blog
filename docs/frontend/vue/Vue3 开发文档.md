# Vue3 开发文档基础

### 获取this

Vue2 中每个组件里使用 this 都指向当前组件实例，而 Vue3 组合式 API 中没有 this，如果想要类似的用法，有两种，一是获取当前组件实例，二是获取全局实例。

```vue
<script setup>
import { getCurrentInstance } from 'vue'

// proxy 就是当前组件实例，可以理解为组件级别的 this，没有全局的、路由、状态管理之类的
const { proxy, appContext } = getCurrentInstance()

// 这个 global 就是全局实例
const global = appContext.config.globalProperties
</script>

```



### 全局注册（属性/方法）

Vue2 中我们要往全局上挂载东西通常就是如下，然后在所有组件里都可以通过 `this.xxx` 获取到了

```vue
Vue.prototype.xxx = xxx
```

而 Vue3 中不能这么写了，换成了一个能被所有组件访问到的全局对象，就是上面说的全局实例的那个对象，比如在 `main.js` 中做全局注册

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
// 添加全局属性
app.config.globalProperties.name = '沐华'

```

在其他组件中调用

```VUE
<script setup>
import { getCurrentInstance } from 'vue'
const { appContext } = getCurrentInstance()

const global = appContext.config.globalProperties
console.log(global.name) // 沐华
</script>

```



### 获取DOM

```VUE
<template>
    <el-form ref="formRef"></el-form>
    <child-component />
</template>
<script setup lang="ts">
import ChildComponent from './child.vue'
import { getCurrentInstance } from 'vue'
import { ElForm } from 'element-plus'

// 方法一，这个变量名和 DOM 上的 ref 属性必须同名，会自动形成绑定
const formRef = ref(null)
console.log(formRef.value) // 这就获取到 DOM 了

// 方法二
const { proxy } = getCurrentInstance()
proxy.$refs.formRef.validate((valid) => { ... })

// 方法三，比如在 ts 里，可以直接获取到组件类型
// 可以这样获取子组件
const formRef = ref<InstanceType<typeof ChildComponent>>()
// 也可以这样 获取 element ui 的组件类型
const formRef = ref<InstanceType<typeof ElForm>>()
formRef.value?.validate((valid) => { ... })
</script>

```



### ref 和 reactive

这两都是用于创建响应式对象，`ref` 通常用于创建基础类型，`reactive` 通常用于创建响应式，这是官方推荐的，现实中也不尽然，有人也用 `ref` 来定义数组，也有人一个组件只定义一个 `reactive`，所有数据都放里面，就像 Vue2 的 `data` 一样，也有人都用

需要知道的有两点：

- `ref` 如果传入的是引用类型，内部源码也是调用 `reactive` 来实现的
- `ref` 返回的属性在 `template` 中使用，直接用就是了，但是在 JS 中使用，需要通过 `.value` 获取，如下。因为 ref 返回的是一个包装对象

```vue
<template>
    <div>{{ count }}</div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const count = ref(1)

// 有人这么用 
const arr = ref([])
console.log(arr.value) // []

// 也有人这么用，一个组件里所有的属性全部定义在一个对象里，有点 Vue2 data 的味道
const data = reactive({
    name: '沐华',
    age: 18,
    ...
})
console.log(data.name) // 沐华

// 也有人一个组件里 ref 和 reactive 两种都用，随便你
</script>

为什么 ref 要返回一个包装对象？Vue2 中 data 都是返回一个对象这都知道
因为对象引用类型，可以用来做代理或劫持，如果只返回基础类型的话，存储在栈中，执行栈里执行完就回收了，没有办法添加代理或劫持，自然就没办法追踪后续的变化，所以不得不返回一个对象，这样才能有响应式
```



### toRef 和 toRefs

这两共同点就是用来创建响应式的引用的，主要用来取出响应式对象里的属性，或者解构响应式对象，解构出来的属性值依然是响应式属性，如果不用这两直接解构的话是会丢失响应式效果的

主要就是方便我们使用直接变量 `xxx`，而不需要 `data.xxx`。并且我们修改 `xxx` 的时候也是直接修改源对象属性的

这两的区别：带 s 和不带 s，就是单数和复数嘛，意思就是取一个和取一堆咯

```vue
<script setup>
import { reactive, toRef, toRefs } from 'vue'

const data = reactive({
    name: '沐华',
    age: 18
})

// 这样虽然能拿到 name / age，但是会变成普通变量，没有响应式效果了
const { name, age } = data

// 取出来一个响应式属性
const name = toRef(data, 'name')

// 这样解构出来的所有属性都是有响应式的
const { name, age } = toRefs(data)

// 不管是 toRef 还是 toRefs，这样修改是会把 data 里的 name 改掉的
// 就是会改变源对象属性，这才是响应式该有的样子
name.value = '沐沐华华'
</script>

```



### watch监听

`watch` 就是用来监听一个已有属性，发生变化的时候做某些操作，Vue2 中常用有如下三种写法

```javascript
watch: {
    userId: 'getData',
    userName (newName, oldName) {
        this.getData()
    },
    userInfo: {
        handler (newVal, newVal) { this.getData() },
        immediate: true,
        deep: true
    }
}
```

而 Vue3 中监听的写法就丰富得多了

Vue3 的 `watch` 是一个函数，能接收三个参数，参数一是监听的属性，参数二是接收新值和老值的回调函数，参数三是配置项

```VUE
<script setup>
import { watch, ref, reactive } from 'vue'

const name = ref('沐华')
const data = reactive({
    age: 18,
    money: 100000000000000000000,
    children: []
})

// 监听 ref 属性
watch(name, (newName, oldName) => { ... })

// 监听其他属性、路由或者状态管理的都这样
watch(
    () => data.age, 
    (newAge, oldAge) => { ... }
)

// 监听多个属性，数组放多个值，返回的新值和老值也是数组形式
watch([data.age, data.money], ([newAge, newMoney], [oldAge, oldMoney]) => { ... })

// 第三个参数是一个对象，为可配置项，有5个可配置属性
watch(data.children, (newList, oldList) => { ... }, {
    // 这两个和 Vue2 一样，没啥说的
    immediate: true,
    deep: true,
    // 回调函数的执行时机，默认在组件更新之前调用。更新后调用改成post
    flush: 'pre', // 默认值是 pre，可改成 post 或 sync
    // 下面两个是调试用的
    onTrack (e) { debugger }
    onTrigger (e) { debugger }
})
</script>

```

关于副作用，`watch` 和后面说到的 `watchEffect` 是一样的。

在 `watch` 回调函数中能接收第三个参数 `onInvalidate`，为清除副作用的函数，首次触发监听的回调函数(handler)不会执行 `onInvalidate`，之后每次触发**默认**会先执行 `onInvalidate`

就是说**默认**它的执行机制在更新之前调用，比如如下代码，当 `key` 触发更新时会先打印 `222` 再打印 `沐华`，如果需要在更新之后调用，可以在 `watch` 第三个配置项中添加 `flush: post`，

```javascript
// 回调函数接收一个参数，为清除副作用的函数
watch(key, (newKey, oldKey, onInvalidate) => {
    console.log('沐华')
    // 获取DOM默认获取到的是更新前的dom，如果是flush: post，可以获取到更新后的dom
    console.log('DOM节点：', dom.innterHTML)
    onInvalidate(() => {
        console.log(2222)
    })
})

```

`onInvalidate` 的使用场景就是：比如监听的回调函数(handler)里有一些异步操作，当再次触发 `watch` 的时候可以用它来对前面未完成的异步任务执行取消/忽略/重置/初始化某些操作，比如取消上一次触发 `watch` 时未完成的请求



### watchEffect

Vue3 中除了 `watch` 还增加了一个 `watchEffect`。区别是：

- `watch` 是对传入的一个或多个值进行监听，触发时会返回新值和老值，且默认第一次不会执行
- `watchEffect` 是传入一个立即执行函数，所以默认第一次就会执行，且不需要传入监听内容，会自动收集函数内的数据源作为依赖，当依赖发生变化时会重新执行函数(有点像`computed`的味道)，而且不会返回新值和老值
- 清除副作用和副作用的刷新时机是一样的，区别是 `watch` 中会作为回调的第三个参数传入，`watchEffect` 中是回调函数的第一个参数
- 正常情况下组件销毁/卸载后这两都会自动停止监听，但也有例外，比如异步的方式，在 `setTimeout` 里创建的监听就都需要手动停止监听，停止方式如下

```vue
// 监听方法赋值
const unwatch = watch('key', callback)
const unwatchEffect = watchEffect(() => {})
// 需要停止监听的时候，手动调用停止监听
unwatch()
unwatchEffect()

```

`watchEffect` 使用：

```vue
<script setup>
import { watchEffect } from 'vue'

// 正常使用
watchEffect(() => {
    // 会自动收集这个函数使用到的属性作为依赖，进行监听
    // 监听的是 userInfo.name 属性，不会监听 userInfo
    console.log(userInfo.name)
})

// 有两个参数，参数一是触发监听回调函数，参数二是可选配置项
watchEffect(() => {...}, {
    // 这里是可配置项，意思和 watch 是一样的，不过这只有3个可配置的
    flush: 'pre',
    onTrack (e) { debugger }
    onTrigger (e) { debugger }
})

// 回调函数接收一个参数，为清除副作用的函数，和 watch 的同理
watchEffect(onInvalidate => {
    console.log('沐华')
    onInvalidate(() => {
        console.log(2222)
    })
})
</script>

```

`watchEffect` 如果需要修改配置项 `flush` 为 `post` 或 `sync` 时，可以直接使用别名，如下

```vue
watchEffect(() => {...}, {
    flush: 'post',
})
// 和下面这个是一样的
watchPostEffect(() => {})
-----------------------------
watchEffect(() => {...}, {
    flush: 'sync',
})
// 和下面这个是一样的
watchSyncEffect(() => {})

```



### computed计算属性

Vue2 中 `computed` 最见的使用场景一般有： `mapGetters/mapState` 获取状态管理的属性、 获取 url 上的属性、条件判断、类型转换之类的，支持函数和对象两种写法

而 Vue3 中 `computed` 不再是一个对象，而是一个函数，用法其实基本差不多，函数第一个参数是侦听器源，用于返回计算的新值，也支持对象写法，第二个参数可用于调试

```vue
<script setup>
import { computed } from 'vue'
const props = defineProps(['visible', 'type'])
const emit = defineEmits(["myClick"])

// 函数写法，计算类型
const isFirst = computed(() => props.type === 1)

// 对象写法
const status = computed({
    get () { return props.visible }, // 相当于 Vue2中的 this.visible
    set (val) { emit('myClick', val) } // 相当于 Vue2中的 this.$emit('input', val)
})

// computed 第二个参数也是一个对象，调试用的
const hehe = computed(参数一上面两种都可， {
    onTrack (e) { debugger }
    onTrigger (e) { debugger }
})
</script>

```



### nextTick

`nextTick` 的使用方法，除了不能用 `this` 其他的和 Vue2 一模一样，还是三种方式

```vue
<script setup>
import { nextTick} from 'vue'

// 方式 一
const handleClick = async () => {
  await nextTick()
  console.log('沐华')
}

// 方式二
nextTick(() => {
    console.log('沐华')
})

// 方式三
nextTick().then(() => {
    console.log('沐华')
  })
</script>

```



### mixins 和 hooks

Vue2 中逻辑的抽离复用一般用 `mixins`，缺点有三：

- 没有独立命名空间，mixins 会和组件内部产生命名冲突
- 不去翻代码不知道引入的 mixins 里面有啥
- 引入多个 mixins 时不知道自己使用的是来自哪一个 mixins 的

Vue3 中逻辑抽离复用的 `hooks` 语法，其实就是一个函数，可以传参，拿返回值来用。或者可以这样理解：平时要封装公用的方法是怎么写的？Vue3 里就可以怎么写

```javascript
// xxx.js
expport const getData = () => {}
export default function unInstance () {
    ...
    return {...}
}

// xxx.vue
import unInstance, { getData } from 'xx.js'
const { ... } = unInstance()
onMounted(() => {
    getData()
})

```



### 组件通信

Vue3 组件通信的方式，有如下几种

#### props + defineProps

```vue
// Parent.vue 传送
<child :msg2="msg2"></child>
<script setup>
    import child from "./child.vue"
    import { ref, reactive } from "vue"
    const msg2 = ref("这是传给子组件的信息2")
    // 或者复杂类型
    const msg2 = reactive(["这是传级子组件的信息2"])
</script>

// Child.vue 接收
<script setup>
    // 不需要引入 直接使用
    // import { defineProps } from "vue"
    const props = defineProps({
        // 写法一
        msg2: String
        // 写法二
        msg2:{
            type:String,
            default:""
        }
    })
    console.log(props) // { msg2:"这是传级子组件的信息2" }
</script>

```

```js
// 以下为props校验
defineProps({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // 必传但可为 null 的字符串
  propD: {
    type: [String, null],
    required: true
  },
  // Number 类型的默认值
  propE: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propF: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propG: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propH: {
    type: Function,
    // 不像对象或数组的默认，这不是一个
    // 工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
})
```



#### defineEmits

```vue
// Child.vue 派发
<template>
    // 写法一
    <button @click="emit('myClick')">按钮</buttom>
    // 写法二
    <button @click="handleClick">按钮</buttom>
</template>
<script setup>
    
    // 方法一 适用于Vue3.2版本 不需要引入
    // import { defineEmits } from "vue"
    // 对应写法一
    const emit = defineEmits(["myClick","myClick2"])
    // 对应写法二
    const handleClick = ()=>{
        emit("myClick", "这是发送给父组件的信息")
    }
    
    // 方法二 不适用于 Vue3.2版本，该版本 useContext()已废弃
    import { useContext } from "vue"
    const { emit } = useContext()
    const handleClick = ()=>{
        emit("myClick", "这是发送给父组件的信息")
    }
</script>

// Parent.vue 响应
<template>
    <child @myClick="onMyClick"></child>
</template>
<script setup>
    import child from "./child.vue"
    const onMyClick = (msg) => {
        console.log(msg) // 这是父组件收到的信息
    }
</script>

```



#### defineExpose / ref

```vue
// Child.vue
<script setup>
    // 方法一 不适用于Vue3.2版本，该版本 useContext()已废弃
    import { useContext } from "vue"
    const ctx = useContext()
    // 对外暴露属性方法等都可以
    ctx.expose({
        childName: "这是子组件的属性",
        someMethod(){
            console.log("这是子组件的方法")
        }
    })
    
    // 方法二 适用于Vue3.2版本, 不需要引入
    // import { defineExpose } from "vue"
    defineExpose({
        childName: "这是子组件的属性",
        someMethod(){
            console.log("这是子组件的方法")
        }
    })
</script>

// Parent.vue  注意 ref="comp"
<template>
    <child ref="comp"></child>
    <button @click="handlerClick">按钮</button>
</template>
<script setup>
    import child from "./child.vue"
    import { ref } from "vue"
    const comp = ref(null)
    const handlerClick = () => {
        console.log(comp.value.childName) // 获取子组件对外暴露的属性
        comp.value.someMethod() // 调用子组件对外暴露的方法
    }
</script>

```



#### useAttrs

`attrs`：包含父作用域里除 class 和 style 除外的非 props **属性集合**

```vue
// Parent.vue 传送
<child :msg1="msg1" :msg2="msg2" title="3333"></child>
<script setup>
    import child from "./child.vue"
    import { ref, reactive } from "vue"
    const msg1 = ref("1111")
    const msg2 = ref("2222")
</script>

// Child.vue 接收
<script setup>
    import { defineProps, useContext, useAttrs } from "vue"
    // 3.2版本不需要引入 defineProps，直接用
    const props = defineProps({
        msg1: String
    })
    // 方法一 不适用于 Vue3.2版本，该版本 useContext()已废弃
    const ctx = useContext()
    // 如果没有用 props 接收 msg1 的话就是 { msg1: "1111", msg2:"2222", title: "3333" }
    console.log(ctx.attrs) // { msg2:"2222", title: "3333" }
    
    // 方法二 适用于 Vue3.2版本
    const attrs = useAttrs()
    console.log(attrs) // { msg2:"2222", title: "3333" }
</script>

```



#### v-model(支持多个)

```vue
// Parent.vue
<child v-model:key="key" v-model:value="value"></child>
<script setup>
    import child from "./child.vue"
    import { ref, reactive } from "vue"
    const key = ref("1111")
    const value = ref("2222")
</script>

// Child.vue
<template>
    <button @click="handlerClick">按钮</button>
</template>
<script setup>
    
    // 方法一  不适用于 Vue3.2版本，该版本 useContext()已废弃
    import { useContext } from "vue"
    const { emit } = useContext()
    
    // 方法二 适用于 Vue3.2版本，不需要引入
    // import { defineEmits } from "vue"
    const emit = defineEmits(["key","value"])
    
    // 用法
    const handlerClick = () => {
        emit("update:key", "新的key")
        emit("update:value", "新的value")
    }
</script>

```

> 从 Vue 3.4 开始，推荐的实现方式是使用 [`defineModel()`](https://cn.vuejs.org/api/sfc-script-setup.html#definemodel) 宏：

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>

<!-- Parent.vue -->
<Child v-model="countModel" />
```

`defineModel()` 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用：

- 它的 `.value` 和父组件的 `v-model` 的值同步；
- 当它被子组件变更了，会触发父组件绑定的值一起更新。

这意味着你也可以用 `v-model` 把这个 ref 绑定到一个原生 input 元素上，在提供相同的 `v-model` 用法的同时轻松包装原生 input 元素：

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```



#### provide / inject

provide / inject 为依赖注入

`provide`：可以让我们指定想要提供给后代组件的数据或

`inject`：在任何后代组件中接收想要添加在这个组件上的数据，不管组件嵌套多深都可以直接拿来用

```vue
// Parent.vue
<script setup>
    import { provide } from "vue"
    provide("name", "沐华")
</script>

// Child.vue
<script setup>
    import { inject } from "vue"
    const name = inject("name")
    console.log(name) // 沐华
</script>

```



#### Vuex / Pinia

**Vuex**： `State`、`Gettes`、`Mutations`(同步)、`Actions`(异步)

**Pinia**： `State`、`Gettes`、`Actions`(同步异步都支持)

> ## Vuex如下

```VUE
// store/index.js
import { createStore } from "vuex"
export default createStore({
    state:{ count: 1 },
    getters:{
        getCount: state => state.count
    },
    mutations:{
        add(state){
            state.count++
        }
    }
})

// main.js
import { createApp } from "vue"
import App from "./App.vue"
import store from "./store"
createApp(App).use(store).mount("#app")

// Page.vue
// 方法一 直接使用
<template>
    <div>{{ $store.state.count }}</div>
    <button @click="$store.commit('add')">按钮</button>
</template>

// 方法二 获取
<script setup>
    import { useStore, computed } from "vuex"
    const store = useStore()
    console.log(store.state.count) // 1

    const count = computed(()=>store.state.count) // 响应式，会随着vuex数据改变而改变
    console.log(count) // 1 
</script>

```



> ## Pinia 核心特性

Pinia 没有 `Mutations`

`Actions` 支持同步和异步

没有模块的嵌套结构

- Pinia 通过设计提供扁平结构，就是说每个 store 都是互相独立的，谁也不属于谁，也就是扁平化了，更好的代码分割且没有命名空间。当然你也可以通过在一个模块中导入另一个模块来隐式嵌套 store，甚至可以拥有 store 的循环依赖关系

更好的 `TypeScript` 支持

- 不需要再创建自定义的复杂包装器来支持 TypeScript 所有内容都类型化，并且 API 的设计方式也尽可能的使用 TS 类型推断

不需要注入、导入函数、调用它们，享受自动补全，让我们开发更加方便

无需手动添加 store，它的模块默认情况下创建就自动注册的

Vue2 和 Vue3 都支持

- 除了初始化安装和SSR配置之外，两者使用上的API都是相同的

支持 `Vue DevTools`

- 跟踪 actions, mutations 的时间线
- 在使用了模块的组件中就可以观察到模块本身
- 支持 time-travel 更容易调试
- 在 Vue2 中 Pinia 会使用 Vuex 的所有接口，所以它俩不能一起使用
- 但是针对 Vue3 的调试工具支持还不够完美，比如还没有 time-travel 功能

模块热更新

- 无需重新加载页面就可以修改模块
- 热更新的时候会保持任何现有状态

支持使用插件扩展 Pinia 功能

支持服务端渲染

```javascript
// 安装
npm install pinia

// main.ts 初始化配置
import { createPinia } from 'pinia'
createApp(App).use(createPinia()).mount('#app')

// 在 store 目录下创建一个 user.ts 为例，我们先定义并导出一个名为 user 的模块
import { defineStore } from 'pinia'
export const userStore = defineStore('user', {
    state: () => {
        return { 
            count: 1,
            arr: []
        }
    },
    getters: { ... },
    actions: { ... }
})

// defineStore 接收两个参数
第一个参数就是模块的名称，必须是唯一的，多个模块不能重名，Pinia 会把所有的模块都挂载到根容器上
第二个参数是一个对象，里面的选项和 Vuex 差不多

其中 state 用来存储全局状态，它必须是箭头函数，为了在服务端渲染的时候避免交叉请求导致的数据状态污染所以只能是函数，而必须用箭头函数则为了更好的 TS 类型推导
getters 就是用来封装计算属性，它有缓存的功能
actions 就是用来封装业务逻辑，修改 state
```



> ### 访问state

比如我们要在页面中访问 state 里的属性 count

由于 `defineStore` 会返回一个函数，所以要先调用拿到数据对象，然后就可以在模板中直接使用了

如下这样通过 `store.xxx` 使用，是具备响应式的

```vue
<template>
    <div>{{ store.count }}</div>
</template>
<script lang="ts" setup>
import { userStore } from '../store'
const store = userStore()
// 解构
// const { count } = userStore()
</script>

```
比如像注释中的解构出来使用，也可以用，只是这样拿到的数据不是响应式的，如果要解构还保持响应式就要用到一个方法 storeToRefs()，示例如下

```vue
<template>
    <div>{{ count }}</div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { userStore } from '../store'
const { count } = storeToRefs(userStore())
</script>
```

原因就是 Pinia 其实是把 state 数据都做了 `reactive` 处理，和 Vue3 的 reactive 同理，解构出来的也不是响应式，所以需要再做 `ref` 响应式代理



> ### getters

这个和 Vuex 的 getters 一样，也有缓存功能。如下在页面中多次使用，第一次会调用 getters，数据没有改变的情况下之后会读取缓存

```javascript
<template>
    <div>{{ myCount }}</div>
    <div>{{ myCount }}</div>
    <div>{{ myCount }}</div>
</template>

getters: {
    // 方法一，接收一个可选参数 state
    myCount(state){
        console.log('调用了') // 页面中使用了三次，这里只会执行一次，然后缓存起来了
        return state.count + 1
    },
    // 方法二，不传参数，使用 this
    // 但是必须指定函数返回值的类型，否则类型推导不出来
    myCount(): number{
        return this.count + 1
    }
}

```



> ### 更新和 actions

更新 state 里的数据有四种方法，我们先看三种简单的更新，说明都写在注释里了

```vue
<template>
    <div>{{ user_store.count }}</div>
    <button @click="handleClick">按钮</button>
</template>
<script lang="ts" setup>
import { userStore } from '../store'
const user_store = userStore()
const handleClick = () => {
    // 方法一
    user_store.count++
    
    // 方法二，需要修改多个数据，建议用 $patch 批量更新，传入一个对象
    user_store.$patch({
        count: user_store.count1++,
        // arr: user_store.arr.push(1) // 错误
        arr: [ ...user_store.arr, 1 ] // 可以，但是还得把整个数组都拿出来解构，就没必要
    })
    
    // 使用 $patch 性能更优，因为多个数据更新只会更新一次视图
    
    // 方法三，还是$patch，传入函数，第一个参数就是 state
    user_store.$patch( state => {
        state.count++
        state.arr.push(1)
    })
}
</script>

```

第四种方法就是当逻辑比较多或者请求的时候，我们就可以封装到示例中 store/user.ts 里的 actions 里

可以传参数，也可以通过 this.xx 可以直接获取到 state 里的数据，需要注意的是不能用箭头函数定义 actions，不然就会绑定外部的 this 了

```vue
actions: {
    changeState(num: number){ // 不能用箭头函数
        this.count += num
    }
}

// 调用
const handleClick = () => {
    user_store.changeState(1)
}

```



### 路由

Vue-Router 4 使用如下，主要是 `route` 和 `router` 打印出来看一下就知道了

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
const app = createApp(App)
app.use(Router)
...

// router/index.js
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// 这个 routes 数组里面就和 vue2 一样写
const routes = [  // ts版这行就是 const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: { name: 'login' } }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // 项目没用这个就不传
  routes
})
export default router

// 需要用到路由的 .vue 文件里
<script setup>
import { useRoute, useRouter } from "vue-router"
// route 对应 Vue2 里的 this.$route
const route = useRoute()
// router 对应 Vue2 里的 this.$router
const router = useRouter()
</script>

```



### CSS 样式穿透

Vue2 中在 `scoped` 中修改子组件或者组件库中的组件样式，改不了的情况下，就可以用样式穿透，不管是 `Less` 还是 `SASS` 都是用 `/deep/ .class {}` 来做样式穿透，而 Vue3 中就不支持 `/deep/` 的写法了，换成 `:deep(.class)`

```css
<style lang="scss" scoped>
// 这样写不生效的话
.el-form {
    .el-form-item { ... }
}
// Vue2 中这样写
/deep/ .el-form {
    .el-form-item { ... }
}
// Vue3 中这样写
:deep(.el-form) {
    .el-form-item { ... }
}
</style>

// 别再一看没生效，就这样加一个没有 scoped 的 style 标签了，一鼓脑全都加到全局上去了
// 除非是全局都要改的
// 还有些需要加到全局的场景，但只改当前页的，比如有些ui组件是挂在全局上的，可以加个当前页独有的类名就是了
// <style lang="scss">
//  .el-form {
//     .el-form-item { ... }
//  }
// </style>
```



### CSS 绑定 JS 变量

就是 CSS 中可以使用 JS 的变量来赋值，如下

```vue
<template>
    <div class="name">沐华</div>
</template>
<script setup>
import { ref } from "vue"
const str = ref('#f00') // 红色
</script>
<style scoped lang="scss">
.name {
    background-color: v-bind(str); // JS 中的色值变量 #f00 就赋值到这来了
}
</style>
```

