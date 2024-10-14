# Vue3中优雅的使用Dialog弹框
### 1、命令式Dialog组件封装
> 封装dialog组件

```vue
<template>
  <Teleport to="body">
    <el-dialog
      v-for="(item, index) in dialogList"
      :key="index"
      v-model="item.visible"
      :append-to-body="item.props?.appendToBody"
      :close-on-click-modal="item.props?.closeOnClickModal"
      :destroy-on-close="true"
      :draggable="item.props?.draggable"
      :fullscreen="item.props?.fullscreen"
      :modal="item.props?.modal"
      :title="item.props?.title"
      :width="item.props?.width"
      @close="() => closeDialog(item, index, '', true)"
      >
      <component :is="item.component"
        :callBack="(...args:any)=>closeDialog(item,index,args)"
        v-bind="item.props"
        @close="(...args:any) => closeDialog(item, index, args)"/>
    </el-dialog>
  </Teleport>
</template>

<script lang="ts" setup>
  import {closeDialog, dialogList} from "./BaseDialog";
</script>

<style lang="scss">
  .el-dialog__body{
    padding: 20px 20px 30px 20px!important;
  }
</style>

```
```typescript
import {markRaw, reactive} from "vue"

type dialogProps = {
  title?: string
  appendToBody?: boolean
  width?: string
  fullscreen?: boolean
  closeOnClickModal?: boolean
  modal?: boolean
  draggable?: boolean
}

type dialogOptions = {
  component: any
  props?: dialogProps
  callBack?: Function
  visible?: boolean
}

/**
 * 对话框列表
 */
export const dialogList: dialogOptions[] = reactive([])

/**
 * 添加对话框
 * @param options 对话框参数
 */
export const showDialog = (options: dialogOptions) => {
  const defaultProps: dialogProps = {
    title: "对话框标题",
    appendToBody: true,
    width: "600px",
    fullscreen: false,
    closeOnClickModal: false,
    modal: true,
    draggable: false
  }
  options.props = Object.assign(defaultProps, options.props)
  options.component = markRaw(options.component)
  dialogList.push(Object.assign(options, {visible: true}))
}

/**
 * 关闭对话框
 * @param item 当前对话框
 * @param i 当前对话框索引
 * @param args 回调参数
 * @param isNativeClose 是否是原生关闭
 */
export const closeDialog = (item: dialogOptions, i: number, args?: any, isNativeClose?: boolean) => {
  dialogList.splice(i, 1)
  if (!isNativeClose) item.callBack && item.callBack(...args)
}

```

> 在App.vue中引入

```vue
<template>
  <router-view />
  <BaseDialog />
</template>

<script setup>
  import useSettingsStore from '@/store/modules/settings'
  import { handleThemeStyle } from '@/utils/theme'
  import {nextTick, onMounted} from "vue";
  import BaseDialog from "@/components/BaseDialog/BaseDialog.vue";

  onMounted(() => {
    nextTick(() => {
      // 初始化主题样式
      handleThemeStyle(useSettingsStore().theme)
    })
  })
</script>

```

### 2、UseDialog hooks封装

1. 创建一个div节点，将它插入到body节点下 
2. 再创建一个showDialog()函数，里面包含一个vnode，当调用mouted函数进行挂载时，通过render函数将该vnode渲染到刚刚创建的div节点下。 
3. 再创建一个closeDialog()函数，渲染为null，关闭弹出的时候卸载，这样我们就不需要在每个组件引入dialog并且每个dialog要声明一个变量控制它是否显示了。
4. 使用的时候引入UseDialog，通过UseDialog.showDialog方法进行使用。
```typescript
import {ElDialog} from 'element-plus'
import {getCurrentInstance, h, render} from 'vue'

type dialogOptions = {
    component: any
    props?: Object
    callBack?: Function
}

export function useDialog() {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const current = getCurrentInstance()

    function showDialog(options: dialogOptions) {
        const defaultProps: object = {
            title: "对话框标题",
            appendToBody: true,
            width: "600px",
            fullscreen: false,
            closeOnClickModal: false,
            modal: true,
            draggable: false
        }
        options.props = Object.assign(defaultProps, options.props)
        const vNode = h(
            ElDialog,
            {
                modelValue: true,
                ...options.props,
                'update:modelValue': (value: boolean) => {
                    if (!value) {
                        closeDialog()
                    }
                },
                callBack: () => {
                    closeDialog()
                }
            },
            {
                // ElDialog 默认插槽
                default: () =>
                    h(options.component, {
                        ...options.props,
                        callBack: () => {
                            if (options.callBack) options.callBack()
                            closeDialog()
                        }
                    })
            }
        )
        vNode.appContext = current?.appContext!
        render(vNode, div)
        return closeDialog
    }

    function closeDialog() {
        render(null, div)
    }

    return {
        showDialog,
        closeDialog
    }
}

```
