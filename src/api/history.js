import http from './http'

const save = data =>
    http.request({
        url: '/history',
        method: 'POST',
        data
    })
const query = params =>
    http.request({
        url: '/history',
        method: 'GET',
        params
    })
export const HISTORY_API = {
    save,
    query
}
