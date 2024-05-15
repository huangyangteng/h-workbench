const path = require('path')
const fs = require('fs')

const capitalized = word => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}
;(function() {
    const [nodeEnv, dir, ...args] = process.argv
    const name = args[0]
    if (!name) {
        console.log('请传递参数作为文件名')
        return false
    }
    //1.新建文件
    //2.写入内容
    const absolutePath =
        path.resolve(__dirname, '../', 'src/api') + '/' + name + '.js'
    const Cname=capitalized(name)
    const content =
`import http from './http'

export const Get${Cname}List = () =>
    http.request({
        url: '/${name}'
    })
export const Add${Cname} = data =>
    http.request({
        url: '/${name}',
        method: 'POST',
        data
    })

export const Update${Cname} = data =>
    http.request({
        url: '/${name}',
        method: 'POST',
        data
    })`
    fs.writeFileSync(absolutePath, content)
})()
