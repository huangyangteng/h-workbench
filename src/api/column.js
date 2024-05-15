import COLUMN_LIST from '../data/columns'
import http from './http'
import pinyin from 'pinyin'
import { SEARCH_TYPE } from '@/data/search'
import store from '@/store'

const getAllColumns = () => {
    return new Promise(resolve => {
        resolve(COLUMN_LIST)
    })
}

export const COLUMN_API = {
    getAllColumns
}
const formatColumn = column => {
    return Object.assign(column, {
        authorName: column.authorname,
        authorInfo: column.authorinfo,
        searchType: SEARCH_TYPE.COLUMN,
        title_pinyin: pinyin(column.title, {
            segment: true, // 启用分词
            group: true, // 启用词组
            style: pinyin.STYLE_NORMAL // 设置拼音风格设置为普通风格（不带声调），
        })
            .flat()
            .join('')
    })
}
export const getColumns = () => {
    return http
        .request({
            url: '/column',
            method: 'get'
        })
        .then(res => {
            if (res.code === 2000) {
                res.data = res.data.map(formatColumn)
            }
            return res
        })
}

const formatOneColumn = column => {
    let { chapters, articles } = column
    chapters = JSON.parse(chapters)
    articles = JSON.parse(articles)
    articles = articles.map(article => ({
        ...article,
        title: article.article_title,
        audio: article.audio_url
    }))
    const contents = chapters.map(chapter => {
        chapter.subList = articles.filter(
            article => article.chapter_id === chapter.id
        )
        chapter.articleNums = chapter.subList.length
        return chapter
    })
    return Object.assign(column, {
        authorName: column.authorname,
        authorInfo: column.authorinfo,
        contents: contents,
        articles,
        firstArticle: articles[0]
    })
}
export const getOneColumn = cid => {
    return http.get('/column/detail?id=' + cid).then(res => {
        if (res.code === 2000) {
            res.data = formatOneColumn(res.data)
        }
        return res
    })
}
export const updateType = data => {
    return http.request({
        url: '/column',
        method: 'put',
        data
    })
}
/**
  做个缓存
  1. 缓存专栏的信息
  2. 缓存文章内容
  数据存在store中
    Cache
        get
        set
  在Read的mounted中进行初始化，挂在window上面

 */
export const getArticleInfo = aid => {
    const id = store.state.column.articleIdMap[aid]
    if (id) {
        return http.get('/gkarticle/detail?id=' + id)
    } else {
        return http.get('/gkarticle/' + aid)
    }
}


export const getArticleMap = () => {
  return http.get("/gkarticle");
};