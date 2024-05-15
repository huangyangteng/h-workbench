import http from './http'

export const GetCatalogList = () =>
    http.request({
        url: '/catalog'
    })
export const AddCatalog = data =>
    http.request({
        url: '/catalog',
        method: 'POST',
        data
    })

export const UpdateCatalog = data =>
    http.request({
        url: '/catalog',
        method: 'put',
        data
    })
