import {defineConfig} from 'vitepress'
import { head, nav, sidebar } from './configs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "China Jumerry's Blog",
    description: "记录美好生活",
    // header标签里面插入的内容
    head: [["link", {rel: "icon", href: "/favicon.ico"}]],
    themeConfig: {
        // 网站的logo
        logo: "/favicon.ico",
        // 文章右侧大纲目录
        outline: {
            level: [2, 6],
            label: "目录",
        },
        //自定义上下页名
        docFooter: {
            prev: "上一页",
            next: "下一页",
        },
        // 主题
        darkModeSwitchLabel: "深浅模式",
        // 返回顶部label
        returnToTopLabel: "返回顶部",
        // 搜索
        search: {
            provider: "local",
        },
        // 页脚
        footer: {
            message: "Released under the MIT License.",
            copyright: "Copyright © 2024-present China Jumerry",
        },
        // 文档的最后更新时间
        lastUpdated: {
            text: "Updated at",
            formatOptions: {
                dateStyle: "full",
                timeStyle: "medium",
            },
        },
        // 导航栏
        nav,
        // 侧边栏
        sidebar,
        // 社交链接
        socialLinks: [
            {icon: 'github', link: 'https://github.com/vuejs/vitepress'}
        ],
        // 部署的时候需要注意该参数避免样式丢失
        base: "/vitepress-blog-template/",
    }
})
