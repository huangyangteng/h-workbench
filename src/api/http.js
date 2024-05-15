import axios from 'axios'
// import store from '../store'
import router from '../router'
import { Message } from 'element-ui'

let instance = axios.create({
    timeout: 1000 * 600, // 超时时间
    baseURL: '/gk-api' // 设置baseURL，区分开发环境和生产环境
})

const CancelToken = axios.CancelToken
const SILENTS_URLS = ['/user/login', '/history']

/**
 *
 * 保存每次发起的请求，
 * 避免重复发送请求。
 * 数组中的元素的数据结构为
 * {
 *      tag: // 用于标识请求
 *      cancelCallback: // axios中用于取消请求的回调函数
 * }
 */
class RequestList {
    constructor() {
        this.list = []
    }

    add(request) {
        // 处理重复请求
        // 在请求发送之前执行取消操作
        this.remove(request)

        // 将一个请求添加到列表中
        new CancelToken(cancelCallback =>
            this.list.push({
                tag: request.url + '&' + request.method,
                cancelCallback
            })
        )
    }

    remove(completedRequest) {
        this.list.some((pendingRequest, index) => {
            // 判断当前请求是否存在于数组中
            if (
                pendingRequest.tag ===
                completedRequest.url + '&' + completedRequest.method
            ) {
                pendingRequest.cancelCallback() // 执行取消操作
                this.list.splice(index, 1) // 删除请求
            }
        })
    }
}

// 管理权限相关
class AuthManager {
    constructor() {
        let state = localStorage.getItem('vuex')
        try {
            state = JSON.parse(state)
            if (state.user.jwt) {
                this.jwt = state.user.jwt
            } else {
                //未登录
            }
        } catch (error) {
            //未登录
        }
    }

    goLogin() {
        Message.error('登录过期！')
        router.push({ name: 'login' })
    }

    getJWT() {
        return this.jwt
    }

    updateJWT(jwt) {
        // store.dispatch('user/updateJWT', jwt)
        this.jwt = jwt
    }
}

/**
 * 处理请求拦截相关操作
 */
class InterceptorManager {
    constructor(request, resData) {
        this.request = request
        this.resData = resData
        this.authManager = new AuthManager()
        this.requestList = new RequestList()
    }

    handleRequest() {
        this.requestList.add(this.request)
        this.request.headers.jwt = this.authManager.getJWT()

        return this.request
    }

    handleResponse() {
        // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从请求列表中移除
        this.requestList.remove(this.request)
        //

        const item = SILENTS_URLS.find(url => this.request.url.includes(url))
        if (item) {
            return this.resData
        }
        let code = this.resData.code.toString()
        this.handleResponseCode(code)
        return this.resData
    }

    handleResponseCode(code) {
        switch (code) {
            case '2000':
                // this.authManager.updateJWT(this.resData.jwt)
                break
            case '4000':
                this.authManager.goLogin()
                break
            default:
                Message.error('请求失败:' + this.resData.data)
                break
        }
    }

    handleError() {
        const item = SILENTS_URLS.find(url => this.request.url.includes(url))
        if (!item) {
            Message.error(`
            接口访问失败：
            URL：${this.request.config.url}，
            ErrorCode：${this.request.status}，
            StatusText：${this.request.statusText}
            `)
        }

        return Promise.reject(this.request)
    }
}

// 请求拦截
instance.interceptors.request.use(
    config => {
        let interceptor = new InterceptorManager(config)
        return interceptor.handleRequest()
    },
    error => Promise.error(error)
)

// 响应拦截
instance.interceptors.response.use(
    // 请求成功
    res => {
        let interceptor = new InterceptorManager(res.config, res.data)
        return interceptor.handleResponse()
    },
    // 请求失败
    error => {
        const { response } = error
        let interceptor = new InterceptorManager(response)
        return interceptor.handleError()
    }
)

export default instance
