import http from './http'

const add = data =>
    http.request({
        url: '/note',
        method: 'POST',
        data
    })

const query = (userId, itemId) => {
    let url = '/note/' + userId
    if (itemId) {
        url = '/note/' + userId + '?connectId=' + itemId
    }
    return http.request({
        url,
        method: 'GET'
    })
}

const update = data =>
    http.request({
        url: '/note',
        method: 'PUT',
        data
    })
const del = data =>
    http.request({
        url: '/note/delete',
        method: 'POST',
        data
    })
export const NOTE_API = {
    add,
    query,
    update,
    del
}
