export default [
    {
        path: '/workbench',
        component: () => import('./Workbench.vue'),
        children: [
            {
                path: '',
                redirect: '/workbench/column'
            },
            {
                path: '/workbench/music',
                component: () => import('./pages/music/music-list.vue')
            },
            {
                path: '/workbench/recent-music',
                component: () => import('./pages/music/recent-music.vue')
            },
            {
                path: '/workbench/album',
                component: () => import('./pages/music/album-list.vue')
            },
            {
                path: '/workbench/column',
                name: 'workbenchColumn',
                component: () => import('./pages/column/column-list')
            },
            {
                path: '/workbench/recent-column',
                component: () => import('./pages/column/recent-column')
            },
            {
                path: '/workbench/tools',
                component: () => import('./pages/tools/tools-list')
            },
            {
                path: '/workbench/video',
                component: () => import('./pages/video/watch-list.vue')
            },

            {
                path: '/workbench/recent-video',
                component: () => import('./pages/video/recent-video.vue')
            }
        ]
    },
    {
        name: 'watch',
        path: '/workbench/watch/:id',
        component: () => import('./pages/video/watch')
    }
]
