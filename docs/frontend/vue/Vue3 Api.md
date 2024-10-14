# Vue3 Api

### defineModel() 3.4+

这个宏可以用来声明一个双向绑定 prop，通过父组件的 `v-model` 来使用。

在底层，这个宏声明了一个 model prop 和一个相应的值更新事件。如果第一个参数是一个字符串字面量，它将被用作 prop 名称；否则，prop 名称将默认为 `"modelValue"`。在这两种情况下，你都可以再传递一个额外的对象，它可以包含 prop 的选项和 model ref 的值转换选项。

```js
// 声明 "modelValue" prop，由父组件通过 v-model 使用
const model = defineModel()
// 或者：声明带选项的 "modelValue" prop
const model = defineModel({ type: String })

// 在被修改时，触发 "update:modelValue" 事件
model.value = "hello"

// 声明 "count" prop，由父组件通过 v-model:count 使用
const count = defineModel("count")
// 或者：声明带选项的 "count" prop
const count = defineModel("count", { type: Number, default: 0 })

function inc() {
  // 在被修改时，触发 "update:count" 事件
  count.value++
}
```



### defineExpose()

使用 `<script setup>` 的组件是**默认关闭**的——即通过模板引用或者 `$parent` 链获取到的组件的公开实例，**不会**暴露任何在 `<script setup>` 中声明的绑定。

可以通过 `defineExpose` 编译器宏来显式指定在 `<script setup>` 组件中要暴露出去的属性：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板引用的方式获取到当前组件的实例，获取到的实例会像这样 `{ a: number, b: number }` (ref 会和在普通实例中一样被自动解包)
