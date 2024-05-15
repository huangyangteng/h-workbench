import http from './http'

/**
 * @param params
 */
const getList = () =>
    http.request({
        url: '/etf'
    })
const getOne = code =>
    http.request({
        url: '/etf/' + code
    })
const add = data =>
    http.request({
        url: '/etf',
        method: 'POST',
        data
    })

const update = data =>
    http.request({
        url: '/etf',
        method: 'POST',
        data
    })
export const ETF_API = {
    getList,
    add,
    update,
    getOne
}
