import dayjs from 'dayjs'

export function formatHistoryItem(item) {
    return {
        ...item,
        ...JSON.parse(item.info),
        readTime: dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
    }
}

export function formatHistory(list) {
    return list
        .map(item => formatHistoryItem(item))
        .sort((a, b) => dayjs(b.updateTime).unix() - dayjs(a.updateTime).unix())
}
