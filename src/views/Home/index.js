export default [
    {
        path: '/',
        redirect: '/workbench/column'
        // component: () => import('../Workbench/pages')
    },
    {
        path: '/read/:column/:article',
        name: 'read',
        component: () => import('./Read.vue')
    }
]
