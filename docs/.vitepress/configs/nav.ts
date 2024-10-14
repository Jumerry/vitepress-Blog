import type {DefaultTheme} from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
    {text: '首页', link: '/'},
    {text: "站点导航", link: '/nav/'},
    {
        text: '前端开发',
        items: [
            {text: 'JavaScript', link: '/frontend/javaScript/ES6知识点/'},
            {text: 'TypeScript', link: '/frontend/typeScript/TS知识点'},
            {text: 'Vue', link: '/frontend/vue/Vue3 开发文档/'},
        ]
    },
    {
        text: '后端开发',
        items: [
            {text: '数据库', link: '/backend/database/'},
            {text: 'Docker', link: '/backend/docker/'},
        ]
    },
    {text: '深入源码', link: '/deep-source'},
    {text: "旁门左道", link: '/software/Git操作命令/'},
    {text: "踩坑记录", link: '/bug-record/'},
]
