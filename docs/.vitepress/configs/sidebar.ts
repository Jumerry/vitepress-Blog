import type {DefaultTheme} from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
    '/frontend/': [
        {
            text: 'JavaScript',
            collapsed: false,
            items: [
                {text: 'ES6知识点', link: '/frontend/javaScript/ES6知识点'},
                {text: 'Reduce用法', link: '/frontend/javaScript/Reduce用法'},
            ]
        },
        {
            text: 'TypeScript',
            collapsed: false,
            items: [
                {text: 'TS知识点', link: '/frontend/typeScript/TS知识点'},
            ]
        },
        {
            text: 'Vue',
            collapsed: false,
            items: [
                {text: 'Vue3 开发文档基础', link: '/frontend/vue/Vue3 开发文档'},
                {text: 'Vue3 Api', link: '/frontend/vue/Vue3 Api'},
                {text: 'Vue3中优雅的使用Dialog弹框', link: '/frontend/vue/Vue3中优雅的使用Dialog弹框'},
                {text: 'Vue上使用cesium开发三维地图', link: '/frontend/vue/Vue上使用cesium开发三维地图'}
            ]
        },
        {
            text: 'CSS',
            collapsed: false,
            items: [
                {text: 'Scss用法', link: '/frontend/css/Scss用法'},
            ]
        }
    ],

    '/software/': [
        {
            text: '旁门左道',
            items: [
                {text: 'Git操作命令', link: '/software/Git操作命令'},
                {text: 'fnm-Node版本管理工具', link: '/software/fnm-Node版本管理工具'},
                {text: 'Scoop操作命令', link: '/software/Scoop操作命令'},
                {text: 'Windows 终端美化', link: '/software/windows 终端美化'},
            ]
        }
    ]
}
