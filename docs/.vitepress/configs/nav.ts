import type {DefaultTheme} from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
    {text: '首页', link: '/'},
    {text: "站点导航", link: '/nav/'},
    {
        text: '前端开发',
        items: [
            {text: 'ES6', link: '/frontend/ES6/'},
            {text: 'React', link: '/frontend/react/'},
            {text: 'JavaScript', link: '/frontend/javascript/'},
        ]
    },
    {
        text: '后端开发',
        items: [
            {text: 'Oracle', link: '/backend/oracle/'},
            {text: 'MySQL', link: '/backend/mysql/'},
            {text: 'docker', link: '/backend/docker/'},
        ]
    },
    {text: '深入源码', link: '/markdown-examples'},
    {text: "旁门左道", link: '/software/'},
    {text: "踩坑记录", link: '/bug-record/'},
]
