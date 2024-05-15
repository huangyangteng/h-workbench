import http from './http'

const taobaoExpert = data =>
    http.request({
        method: 'POST',
        url: '/util/taobao',
        data
    })
const getFiles = query =>
    http.request({
        url: '/util/files',
        params: query
    })
const upload = data =>
    http.request({
        url: '/util/upload',
        data,
        method: 'POST'
    })
const translate = word =>
    http.request({
        url: '/util/translate',
        params: {
            word
        }
    })
export const UTIL_API = {
    taobaoExpert,
    getFiles,
    upload,
    translate
}
