import Vue from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import router from '../router/index'
// 用于监听、触发事件
export const eventBus = new Vue()

export function uid() {
    var dt = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
    ) {
        var r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
}

export function formatDuration(time) {
    let min = Math.floor(time / 60) % 60
    let sec = Math.floor(time % 60)
    min = min < 10 ? '0' + min : min
    sec = sec < 10 ? '0' + sec : sec
    return min + ':' + sec
}

export function getElementTop(element) {
    let actualTop = element.offsetTop
    let current = element.offsetParent
    while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
    }
    return actualTop
}

export function getElementLeft(element) {
    let actualLeft = element.offsetLeft
    let current = element.offsetParent
    while (current !== null) {
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }
    return actualLeft
}

export function copyToBoard(value) {
    const element = document.createElement('textarea')
    document.body.appendChild(element)
    element.value = value
    element.select()
    if (document.execCommand('copy')) {
        document.execCommand('copy')
        document.body.removeChild(element)
        return true
    }
    document.body.removeChild(element)
    return false
}

/**
 *深拷贝
 * @export
 * @param {*} obj
 * @returns
 */
export function deepCopy(obj) {
    if (typeof obj != 'object') {
        return obj
    }
    if (obj == null) {
        return obj
    }
    return JSON.parse(JSON.stringify(obj))
}

/**
 * 浏览器下载静态文件
 * @param {String} name 文件名
 * @param {String} content 文件内容 二进制流的形式
 */
export function downloadFile(content, name) {
    if (typeof name == 'undefined') {
        throw new Error('The first parameter name is a must')
    }
    if (typeof content == 'undefined') {
        throw new Error('The second parameter content is a must')
    }
    // if (typeof content != 'string') {
    //     throw new Error('The second parameter content must be a string')
    // }
    let eleLink = document.createElement('a')
    eleLink.download = name
    eleLink.style.display = 'none'
    let blob = new Blob([content])
    eleLink.href = URL.createObjectURL(blob)
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
}

//提供一个link，完成文件下载，link可以是  http://xxx.com/xxx.xls
export function downloadByLink(link, fileName) {
    axios
        .request({
            url: link,
            responseType: 'blob'
        })
        .then(res => {
            downloadFile(res.data, fileName)
        })
}

/**
 *
 * @param {*} func 要进行debouce的函数
 * @param {*} wait 等待时间
 * @param {*} immediate 是否立即执行
 */
export function debounce(func, wait, immediate) {
    let timeout
    return function() {
        let context = this
        let args = arguments

        if (timeout) clearTimeout(timeout)
        if (immediate) {
            // 如果已经执行过，不再执行
            let callNow = !timeout
            timeout = setTimeout(function() {
                timeout = null
            }, wait)
            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(function() {
                func.apply(context, args)
            }, wait)
        }
    }
}

/**
 * 节流，多次触发，间隔时间段执行
 * @param {Function} func
 * @param {Int} wait
 * @param {Object} options
 */
export function throttle(func, wait, options) {
    //container.onmousemove = throttle(getUserAction, 1000);
    let timeout, context, args
    let previous = 0
    if (!options) options = {}

    let later = function() {
        previous = options.leading === false ? 0 : new Date().getTime()
        timeout = null
        func.apply(context, args)
        if (!timeout) context = args = null
    }

    let throttled = function() {
        let now = new Date().getTime()
        if (!previous && options.leading === false) previous = now
        let remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            func.apply(context, args)
            if (!timeout) context = args = null
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
        }
    }
    return throttled
}

export function isEnglish(str) {
    const reg = /^\w+$/
    return reg.test(str)
}

export function isVideo(ext) {
    const REG_VIDEO = /^(mp4|mpeg|vob|avi|mpg|wmv|mov|)$/
    return REG_VIDEO.test(ext)
}

/**
 * 获取文件后缀名
 * @param {String} filename
 */
export function getExt(filename) {
    if (typeof filename == 'string') {
        return filename
            .split('.')
            .pop()
            .toLowerCase()
    } else {
        throw new Error('filename must be a string type')
    }
}

export function hashCode(str) {
    const hash = str
        .split('')
        .reduce(
            (prevHash, currVal) =>
                ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
            0
        )
    return Math.abs(hash)
}

/**
 * 对象转化为url参数
 * @param {*} obj
 */
export function getParams(obj) {
    return Object.keys(obj)
        .map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
        })
        .join('&')
}

export function downloadLink(link, name) {
    if (!name) {
        name = link.slice(link.lastIndexOf('/') + 1)
    }
    let eleLink = document.createElement('a')
    eleLink.download = name
    eleLink.style.display = 'none'
    eleLink.href = link
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
}

export function copyText(text) {
    if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(text)
    } else {
        let textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        // 隐藏此输入框
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        // 赋值
        textarea.value = text
        // 选中
        textarea.select()
        // 复制
        document.execCommand('copy', true)
        // 移除输入框
        document.body.removeChild(textarea)
    }
}

export const removeChinese = str => {
    const reg = /[\u4e00-\u9fa5]/g
    return str.replace(reg, '')
}

export function getNow() {
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 获取url参数
 * @param key 参数的key,如果不提供，返回所有参数
 * @param str
 *
 */
export function getParamsByUrl(key, str) {
    if (!str) {
        str = location.href.split('?')[1]
    }
    const params = Object.fromEntries(new URLSearchParams(str))
    if (!key) {
        return params
    } else {
        return params[key]
    }
}

/**
 * routerConfig是router的配置对象{path:'',query:{},params:{}}
 * @param routerConfig
 */

export function newPage(routerConfig) {
    let routeUrl = router.resolve(routerConfig)
    window.open(routeUrl.href, '_blank')
}

/**
 * 休眠
 * @param ms 休眠的毫秒数
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function isElectron() {
    return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1
}
