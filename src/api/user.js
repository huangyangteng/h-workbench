import http from './http'

/**
 * 登录
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
const login = data =>
    http.request({
        url: '/user/login',
        method: 'POST',
        data
    })
/**
 * 注册
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
const register = data =>
    http.request({
        url: '/user',
        method: 'POST',
        data
    })

const addFilterVideo = data =>
    http.request({
        url: '/user/update',
        method: 'POST',
        data
    })

export const USER_API = {
    login,
    register,
    addFilterVideo
}
