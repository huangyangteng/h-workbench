import http from './http'

export const GetArticle = id =>
    http.request({
        url: '/article',
        params: {
            id
        }
    })
export const AddArticle = data =>
    http.request({
        url: '/article',
        method: 'POST',
        data
    })

export const UpdateArticle = data =>
    http.request({
        url: '/article',
        method: 'PUT',
        data
    })
