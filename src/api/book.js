import http from './http'

export const GetBookList = () =>
    http.request({
        url: '/book'
    })
export const AddBook = data =>
    http.request({
        url: '/book',
        method: 'POST',
        data
    })

export const UpdateBook = data =>
    http.request({
        url: '/book',
        method: 'POST',
        data
    })
