export function getAbsoluteSourcePath(src) {
    src = src.replace('./', '')
    return window.location.origin + '/api/' + src
}

/**
 * 通过id获取src
 * @param {*} id
 */
export function getAriticleSrcById(contentsList, id) {
    let tmp = contentsList.map(item => item.subList)
    let listAll = tmp.reduce((prev, next) => {
        return prev.concat(next)
    })
    let cur = listAll.find(item => item.id == id)
    if (cur) {
        return cur.src
    } else {
        return listAll[0].src
    }
}

export function getColumnById(columnList, id) {
    return columnList.filter(item => item.id == id)[0]
}
/**
 *
 *
 * @export
 * @param {*} columnList
 * @param {*} pathList
 */
export function formatColumn(columnList, pathList) {
    let output = {}

    var arr = pathList.map(item => item.name)
    // 初始化output
    arr.forEach(item => {
        output[item] = []
    })
    // 向output中塞数据
    columnList.forEach(item => {
        arr.forEach(type => {
            if (item.type == type) {
                output[type].push(item)
            }
        })
    })
    return output
}
