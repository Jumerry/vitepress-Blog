import type {DefaultTheme} from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
    '/frontend/javaScript': [
        {
            text: 'JavaScript',
            collapsed: false,
            items: [
                {text: 'ES6知识点', link: '/frontend/javaScript/ES6知识点'},
                {text: 'Reduce用法', link: '/frontend/javaScript/Reduce用法'},
            ]
        }
    ],

    '/frontend/typeScript': [
        {
            text: 'TypeScript',
            collapsed: false,
            items: [
                {text: 'TS知识点', link: '/frontend/typeScript/TS知识点'},
            ]
        }
    ],

    '/frontend/vue': [
        {
            text: 'Vue',
            collapsed: false,
            items: [
                {text: 'Vue3 开发文档基础', link: '/frontend/vue/Vue3 开发文档'},
                {text: 'Vue3 Api', link: '/frontend/vue/Vue3 Api'},
                {text: 'Vue3中优雅的使用Dialog弹框', link: '/frontend/vue/Vue3中优雅的使用Dialog弹框'},
                {text: 'Vue上使用cesium开发三维地图', link: '/frontend/vue/Vue上使用cesium开发三维地图'}
            ]
        }
    ]
}
