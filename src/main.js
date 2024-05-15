import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './config/element-ui-config'
import './assets/css/common.scss'
import './assets/css/article.scss'
import 'animate.css'

import VConsole from 'vconsole'

if (process.env.NODE_ENV !== 'production') {
    new VConsole()
}

Vue.config.productionTip = false
const hls = require('videojs-contrib-hls')
Vue.use(hls)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
