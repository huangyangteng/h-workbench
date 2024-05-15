export default [
    {
        path: '/test-db',
        component: () => import('./test-db.vue')
    },
    {
        path: '/test',
        component: () => import('./Test.vue')
    }
]
