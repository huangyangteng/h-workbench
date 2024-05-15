import http from './http'
import { getParams } from '../tools'
import pinyin from 'pinyin'
import { SEARCH_TYPE } from '@/data/search'
//获取所有本地视频列表
const getList = params =>
    http.request({
        url: '/watch',
        params
    })
//查询视频
const query = params =>
    http.request({
        url: '/watch/query',
        params
    })
//更新静态资源地址
const run = path =>
    http.request({
        method: 'POST',
        url: '/watch/run',
        data: getParams({ dir: path })
    })
//获取处理过的B站视频
const getBBVideos = () =>
    http.request({
        url: '/watch/bb-list'
    })
//获取b站视频信息
const getBBCourse = data =>
    http.request({
        method: 'POST',
        url: '/watch/bb',
        data: data
    })
const parseBBVideo = data =>
    http.request({
        method: 'POST',
        url: '/watch/bb-parse',
        data: data
    })
//获取acfun视频信息
const getAcfunCourse = data =>
    http.request({
        method: 'POST',
        url: '/watch/acfun',
        data: data
    })
const addBBVideo = data =>
    http.request({
        method: 'POST',
        url: '/watch/add',
        data
    })
const deleteVideo = ids =>
    http.request({
        method: 'POST',
        url: '/watch/delete',
        data: {
            ids
        }
    })
const updateVideo = data =>
    http.request({
        method: 'PUT',
        url: '/watch/update',
        data
    })

export const WATCH_API = {
    getList,
    run,
    query,
    getBBCourse,
    getAcfunCourse,
    addBBVideo,
    getBBVideos,
    deleteVideo,
    parseBBVideo,
    updateVideo
}
const formatVideo = video => {
    return Object.assign(video, {
        searchType: SEARCH_TYPE.VIDEO,
        title: video.name,
        title_pinyin: pinyin(video.name, {
            segment: true, // 启用分词
            group: true, // 启用词组
            style: pinyin.STYLE_NORMAL // 设置拼音风格设置为普通风格（不带声调），
        })
            .flat()
            .join('')
    })
}
export const getVideoList = () => {
    return http
        .request({
            url: '/watch/bb-list'
        })
        .then(res => {
            if (res.code === 2000) {
                res.data = res.data.map(formatVideo)
            }
            return res
        })
}
