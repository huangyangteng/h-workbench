export default [
    {
        path: '/piano',
        name: 'piano-text',
        component: () => import('./piano-text.vue')
    },
    {
        name: 'guide',
        path: '/guide',
        hide: true,
        component: () => import('./guide.vue')
    },
    {
        name: 'text',
        path: '/text',
        component: () => import('./text-split')
    },
    {
        name: 'eft',
        path: '/etf',
        component: () => import('./etf.vue')
    },
    {
        name: 'diff-date',
        hide: true,
        path: '/diff-date',
        component: () => import('./diff-date')
    },
    {
        name: 'listen-to-music',
        hide: true,
        path: '/listen-to-music',
        component: () => import('./listen-to-music/listen-to-music')
    },
    {
        name: 'weekend-see',
        hide: true,
        path: '/weekend-see',
        component: () => import('./weekend-watch')
    },
    {
        name: 'thinking',
        path: '/thinking',
        component: () => import('./thinking')
    },
    {
        name: 'star-bg',
        hide: true,
        path: '/star-bg',
        component: () => import('./star-bg')
    },
    {
        name: 'pwa-icon',
        hide: true,
        path: '/pwa-icon',
        component: () => import('./pwa-icon')
    },
    {
        name: 'translate',
        path: '/translate',
        hide: true,
        component: () => import('./translate')
    },
    {
        name: 'search',
        hide: true,
        path: '/search',
        component: () => import('./gradute-search')
    },
    {
        name: 'doremi',
        path: '/doremi',
        component: () => import('./doremi/doremi')
    },
    {
        name: '计算房租周期',
        path: '/calc-rent',
        component: () => import('./calc-rent')
    },
    {
        name: '阅读推送',
        path: '/read-push',
        component: () => import('./read-push/read-push')
    },
    {
        name: 'pianoBook',
        path: '/piano-book',
        component: () => import('./doremi/piano-book')
    }
]
