export default [
    {
        path: '/',
        // redirect: '/workbench/video'
        component: () => import('./Home.vue')
    },
    // {
    //     path: '/read',
    //     component: () => import('./Home.vue')
    // },
    {
        path: '/read/:column/:article',
        name: 'read',
        component: () => import('./Read.vue')
    }
]
