// https://vitepress.dev/guide/custom-theme
import {h, watch} from 'vue'
import type {Theme} from 'vitepress'
import {useData} from "vitepress";
import DefaultTheme from 'vitepress/theme'
import './style.css'
import MNavLinks from './components/MNavLinks.vue'
import {createMediumZoomProvider} from './composables/useMediumZoom'
import MLayout from "./components/MLayout.vue";

let homePageStyle: HTMLStyleElement | undefined

export default {
    extends: DefaultTheme,
    Layout: () => {
        const props: Record<string, any> = {}
        // 获取 frontmatter
        const {frontmatter} = useData()

        /* 添加自定义 class */
        if (frontmatter.value?.layoutClass) {
            props.class = frontmatter.value.layoutClass
        }

        return h(MLayout, props)
    },
    enhanceApp({app, router, siteData}) {
        createMediumZoomProvider(app, router)
        app.component('MNavLinks', MNavLinks)

        if (typeof window !== 'undefined') {
            watch(
                () => router.route.data.relativePath,
                () =>
                    updateHomePageStyle(
                        /* /vitepress-nav-template/ 是为了兼容 GitHub Pages */
                        location.pathname === '/' || location.pathname === '/vitepress-nav-template/',
                    ),
                {immediate: true},
            )
        }
    }
} satisfies Theme

if (typeof window !== 'undefined') {
    // detect browser, add to class for conditional styling
    const browser = navigator.userAgent.toLowerCase()
    if (browser.includes('chrome')) {
        document.documentElement.classList.add('browser-chrome')
    } else if (browser.includes('firefox')) {
        document.documentElement.classList.add('browser-firefox')
    } else if (browser.includes('safari')) {
        document.documentElement.classList.add('browser-safari')
    }
}

// Speed up the rainbow animation on home page
function updateHomePageStyle(value: boolean) {
    if (value) {
        if (homePageStyle) return

        homePageStyle = document.createElement('style')
        homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
        document.body.appendChild(homePageStyle)
    } else {
        if (!homePageStyle) return

        homePageStyle.remove()
        homePageStyle = undefined
    }
}
