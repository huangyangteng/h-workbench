import dayjs from 'dayjs'
import { WATCH_MU } from '../mutation-types'

const state = {
    notes: [],
    history: [], //记录每个videoId的history,1分钟记录一次,离开当前路由时记录一次，关闭页面之前记录一次  [{videoId:xxx,currentTime:'',date:'',courseId:''}]
    config: {
        playNext: false, //自动播放下一个
        playRate: 1 //播放速度
    }
}

const getters = {
    //定义需要经过处理才能返回的state
}

const actions = {}

const mutations = {
    //note
    [WATCH_MU.ADD_NOTE](state, { videoId, currentTime, value = '' }) {
        currentTime = Number(currentTime.toFixed(2))
        const index = state.notes.findIndex(item => item.videoId === videoId)
        if (index !== -1) {
            const { list } = state.notes[index]
            list.push({
                date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                currentTime,
                value
            })
            state.notes.splice(index, 1, { videoId, list })
        } else {
            state.notes.push({
                videoId,
                list: [
                    {
                        date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                        currentTime,
                        value
                    }
                ]
            })
        }
    },
    [WATCH_MU.REMOVE_NOTE](state, { videoId, date }) {
        const index = state.notes.findIndex(item => item.videoId === videoId)
        if (index === -1) return
        const { list } = state.notes[index]
        const delIndex = list.findIndex(item => item.date == date)
        if (delIndex === -1) {
            return
        } else {
            list.splice(delIndex, 1)
            const newObj = { ...state.notes[index], list }
            state.notes.splice(index, 1, newObj)
        }
    },
    [WATCH_MU.MODIFY_NOTE](state, { videoId, date, value }) {
        const index = state.notes.findIndex(item => item.videoId == videoId)
        if (index === -1) return
        const { list } = state.notes[index]
        const listIndex = list.findIndex(item => item.date == date)
        if (listIndex == -1) {
            return
        } else {
            list.splice(listIndex, 1, { ...list[listIndex], value })
            const newObj = { ...state.notes[index], list }
            state.notes.splice(index, 1, newObj)
        }
    },
    [WATCH_MU.ADD_HISTORY](state, { videoId, currentTime, ...args }) {
        let index = state.history.findIndex(item => item.videoId == videoId)
        if (index == -1) {
            state.history.push({
                videoId,
                currentTime,
                date: dayjs().format('YYYY-MM-DD hh:mm:ss'),
                ...args
            })
        } else {
            state.history.splice(index, 1, {
                videoId,
                currentTime,
                date: dayjs().format('YYYY-MM-DD hh:mm:ss'),
                ...args
            })
        }
    },
    setConfig(state, config) {
        state.config = Object.assign({}, state.config, config)
    }
}

export default {
    //导出用户模块相关信息
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
