import http from './http'

export const GetReadList = () =>
    http.request({
        url: '/read'
    })
export const AddRead = data =>
    http.request({
        url: '/read',
        method: 'POST',
        data
    })

export const UpdateRead = data =>
    http.request({
        url: '/read',
        method: 'POST',
        data
    })
export const GetTitleFromLink = link =>
    http.request({
        url: '/read/info',
        params: {
            link
        }
    })
