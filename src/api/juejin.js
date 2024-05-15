import http from './http'

/**
 * 获取掘金用户文章列表
 * @param params
 */
const getList = params =>
    http.request({
        url: '/juejin/articles',
        params
    })

/**
 * 点赞 点赞之前必须访问一下文章
 * @param data
 */
const star = data =>
    http.request({
        url: '/juejin/star',
        method: 'POST',
        data
    })

export const JUEJIN_API = {
    getList,
    star
}
