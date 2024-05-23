import http from '@/api/http'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)

export function getWorkList() {
    return http
        .request({
            url: '/work'
        })
        .then(res => {
            let list = res.data.map(item => {
                return {
                    ...item,
                    relativeTime: dayjs(item.date).fromNow()
                }
            })
            //     去重一下
            let set = new Set()
            return list.filter(item => {
                if (!set.has(item.title)) {
                    set.add(item.title)
                    return true
                } else {
                    return false
                }
            })
        })
}
