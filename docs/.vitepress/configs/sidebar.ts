import type {DefaultTheme} from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
    '/frontend/': [
        {
            text: '前端开发',
            items: [
                {text: 'ES6', link: '/frontend/ES6/'},
                {text: 'TypeScript', link: '/frontend/typescript/'},
                {text: 'Vue', link: '/frontend/vue/'},
                {text: 'React', link: '/frontend/react/'},
                {text: 'Node', link: '/frontend/node/'},
                {text: 'Webpack', link: '/frontend/webpack/'},
            ]
        }
    ]
}
