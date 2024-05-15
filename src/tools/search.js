import COLUMNS from '../data/columns'
import { isEnglish } from './index'

/**
 * 查找关键字
 * @param {String} searchKey
 */
export function searchEverything(searchKey, { columns, videos, pages }) {
    //构造正则
    const reg = createReg(searchKey)
    // const articles = findArticles(searchKey, reg, 10)
    const resultColumns = filterItems(columns, searchKey, reg, 4)
    const resultVideos = filterItems(videos, searchKey, reg, 4)
    const resultPages = filterItems(pages, searchKey, reg, 2)
    return [...resultPages, ...resultColumns, ...resultVideos]
}

function createReg(searchKey) {
    let searchKeyArr = searchKey.split('')
    let str = '(.*?)'
    let regStr = str + searchKeyArr.join(str) + str
    return RegExp(regStr, 'i')
}

//从专栏中查找
function filterItems(columns, searchKey, reg, total) {
    // 取前10条
    let sum = 0
    let finds = []
    for (let i = 0; i < columns.length; i++) {
        if (sum === total) break
        //如果输入的都是英文或者数字字符，没有中文
        if (isEnglish(searchKey)) {
            if (reg.test(columns[i].title_pinyin)) {
                finds.push(columns[i])
                sum++
            }
        } else {
            //处理中文
            if (columns[i].title.includes(searchKey)) {
                finds.push(columns[i])
                sum++
            }
        }
    }
    return finds
}

/**
 * 从文章中查找
 * @param searchKey
 * @param reg
 * @param total
 * @returns {*[]}
 */
function findArticles(searchKey, reg, total) {
    //将所有的专栏列表整理到一起
    const list = COLUMNS.map(item => item.contents).reduce((prev, cur) =>
        prev.concat(cur)
    )
    const articles = list
        .map(item => item.subList)
        .reduce((prev, cur) => prev.concat(cur), [])
    // 取前10条
    let sum = 0
    let finds = []
    for (let i = 0; i < articles.length; i++) {
        if (sum === total) break
        if (articles[i].title.toLowerCase().includes(searchKey.toLowerCase())) {
            finds.push(articles[i])
            sum++
        }
        //如果输入的都是英文或者数字字符，没有中文
        // if (isEnglish(searchKey)) {
        //     if (reg.test(articles[i].title_pinyin)) {
        //         finds.push(articles[i])
        //         sum++
        //     }
        // } else {
        //     //处理中文
        //     if (articles[i].title.includes(searchKey)) {
        //         finds.push(articles[i])
        //         sum++
        //     }
        // }
    }
    return finds
}
