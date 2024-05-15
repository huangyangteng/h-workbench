import Vue from 'vue'
import VueRouter from 'vue-router'
import ReadConfig from '../views/Home/index'
import TipConfig from '../views/Tip/index'
import TestConfig from '../views/Test/index'
import ColumnList from '../views/ColumnList/index'
import Tools from '../views/Tools/index'
import workbench from '../views/Workbench/index'
import thinking from '../views/thinking/index'

Vue.use(VueRouter)
import NProgress from 'nprogress'
import '../assets/css/nprogress.css'

const routes = [
    ...workbench,
    ...ReadConfig,
    ...ColumnList,
    ...Tools,
    ...thinking,
    TipConfig,
    ...TestConfig
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    // mode: 'history',
    routes
})
// 前置路由
router.beforeEach((to, from, next) => {
    //to 去哪里
    NProgress.start()
    // LoadingBar.start()
    next()
})
router.afterEach(() => {
    // LoadingBar.finish()
    NProgress.done()
})

export default router
