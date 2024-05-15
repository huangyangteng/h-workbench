import dayjs from 'dayjs'
import { hashCode, uid } from './index'

export const PREVIEW_PREFIX = ''

export function isVideo(ext) {
    const REG_VIDEO = /^(mp4|mpeg|vob|avi|mpg|wmv|mov|)$/
    return REG_VIDEO.test(ext)
}

/**
 * 获取文件后缀名
 * @param {String} filename
 */
export function getExt(filename) {
    if (typeof filename == 'string') {
        return filename
            .split('.')
            .pop()
            .toLowerCase()
    } else {
        throw new Error('filename must be a string type')
    }
}

export function getVideoList(units) {
    let videos = units
        .map(item => item.list)
        .reduce((prev, cur) => prev.concat(cur), [])
    videos = videos.filter(item => isVideo(getExt(item.src)))
    return videos
}

// 获取上次播放的课程id
export function getLastPlay(courseId, history) {
    const courses = history.filter(item => item.courseId == courseId)
    courses.sort((r1, r2) => {
        return dayjs(r2.date).valueOf() - dayjs(r1.date).valueOf()
    })
    if (courses.length > 0) {
        return courses[0]
    } else {
        return null
    }
}

export function getNameById(id, units) {
    const item = getVideoItem(id, units)
    return item ? item.name : ''
}

// 获取下一个播放的视频 length 5 (0,1,2,3,4)
export function getNextVideo(id, units, isLocal) {
    if (!isLocal) {
        let videos = units[0].list
        let index = videos.findIndex(item => item.id == id)
        if (index != -1 && index + 1 != videos.length) {
            return videos[index + 1]
        }
    }
    let videos = units
        .map(item => item.list)
        .reduce((prev, cur) => prev.concat(cur), [])
    videos = videos.filter(item => isVideo(getExt(item.src)))
    let index = videos.findIndex(item => item.id == id)
    console.log('getNextVideo -> index', index)
    if (index != -1 && index + 1 != videos.length) {
        return videos[index + 1]
    }
}

// 获取下一个播放的视频 length 5 (0,1,2,3,4)
export function getPrevVideo(id, units) {
    let videos = units
        .map(item => item.list)
        .reduce((prev, cur) => prev.concat(cur), [])
    videos = videos.filter(item => isVideo(getExt(item.src)))
    let index = videos.findIndex(item => item.id == id)
    console.log('getNextVideo -> index', index)
    if (index != -1 && index >= 1) {
        return videos[index - 1]
    }
}

// 通过视频id获取视频src,如果找不到默认返回第一个可以播放的视频
export function getSrcById(id, units) {
    //如果找不到默认返回第一个可以播放的视频
    let videos = units
        .map(item => item.list)
        .reduce((prev, cur) => prev.concat(cur), [])
    let item = videos.find(item => item.id == id)
    if (item) {
        return item.src
    } else {
        item = videos.find(item => isVideo(getExt(item.src)))
        return item.src
    }
}

export function getVideoItem(id, units) {
    let videos = units
        .map(item => item.list)
        .reduce((prev, cur) => prev.concat(cur), [])
    let item = videos.find(item => item.id == id)
    return item
}

// 格式化时间
export function formatVideoTime(time) {
    let sec_num = parseInt(time, 10) // don't forget the second param
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - hours * 3600) / 60)
    let seconds = sec_num - hours * 3600 - minutes * 60

    if (hours < 10) {
        hours = '0' + hours
    }
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    return hours + ':' + minutes + ':' + seconds
}

//[{id,unit:'unit1',list:[]},{id,unit:'unit2',list:[]}]
export function formatCourse(list, title) {
    const prefix = getPrefix(list[0], title)
    let units = list
        .map(item => item.replace(prefix, ''))
        .map(item => {
            const i = item.indexOf('/')
            return item.slice(0, i)
        })
    units = removeDuplication(units)
    units = units.filter(item => !item.startsWith('.'))
    units.sort((a, b) => {
        return getNumber(a) - getNumber(b)
    })
    return units.map(unit => {
        let arr = []
        list.forEach(item => {
            if (removePrefix(item, prefix).startsWith(unit)) {
                arr.push(item)
            }
        })
        arr = formatWatchList(arr)

        return {
            id: uid(),
            unit: unit,
            list: arr
        }
    })
}
//处理从b站解析出来的课程信息
export function formatBBCourse({ pages, title, isCollection }) {
    if (!isCollection) {
        return [
            {
                id: uid(),
                unit: title,
                list: pages.map(item => {
                    return {
                        ...item,
                        name: item.part,
                        id: item.cid
                    }
                })
            }
        ]
    } else {
        return [
            {
                id: uid(),
                unit: title,
                list: pages.map(item => {
                    return {
                        name: item.title,
                        id: item.bvid,
                        isCollection: true
                    }
                })
            }
        ]
    }
}

function formatWatchList(list) {
    if (!Array.isArray(list)) return

    let formatList = list.map(item => {
        const name = formatName(item)
        return {
            id: hashCode(item),
            name,
            src: formatSrc(item),
            sort: getSort(name)
        }
    })
    formatList = formatList.filter(item => !item.name.startsWith('.'))
    formatList.sort((a, b) => a.sort - b.sort)
    return formatList
}

function formatName(name) {
    return name
        .split('/')
        .pop()
        .replace('(更多IT教程 微信352852792)', '')
        .replace('【更多IT教程 微信535950311】', '')
        .replace('.mp4', '')
}

function getNumber(txt) {
    //优先匹配开头的数字 1xx 2xx
    let numb = txt.match(/^\d+/g)
    if (numb) return Number(numb.join(''))
    // 如果匹配不到，匹配后面的数字 第1章 第2章
    if (!numb) {
        numb = txt.match(/\d/g)
    }
    if (numb) {
        return numb.join('')
    } else {
        return 99999
    }
}

export function formatSrc(str) {
    const i = str.indexOf('learn')
    return str.slice(i, str.length)
}

function removePrefix(str, prefix) {
    return str.replace(prefix, '')
}

function removeDuplication(arr) {
    return [...new Set(arr)]
}

function getSort(str) {
    let reg = /^(\d+)\s*-\s*(\d+)\s*/
    let result = reg.exec(str)
    try {
        return result[2]
    } catch (error) {
        return 9999
    }
}

export function getPrefix(str, title) {
    let i = str.indexOf(title)
    return str.slice(0, i + title.length) + '/'
}

export function download(link, name) {
    let eleLink = document.createElement('a')
    eleLink.download = name
    eleLink.style.display = 'none'
    eleLink.href = link
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
}

export function getAcfunPlaySrc(data) {
    console.log(data)
    const prefix = 'tx-safety-video'
    if (data.src.includes(prefix)) {
        return data.src
    } else {
        const { url, backupUrl } = data.spareSrc[0]
        if (url.includes(prefix)) {
            return url
        } else if (backupUrl[0].includes(prefix)) {
            return backupUrl[0]
        } else {
            throw new Error('找不到播放的视频url')
        }
    }
}
