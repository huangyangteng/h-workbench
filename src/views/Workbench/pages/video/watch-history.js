//历史记录功能
import { HISTORY_API } from '../../../../api/history'
import { SEARCH_TYPE } from '../../../../data/search'
import { Notification } from 'element-ui'
import { eventBus } from '../../../../tools'

export const WatchHistory = {
    data() {
        return {
            historyTimer: null,
            videoHistoryList: []
        }
    },
    computed: {},
    methods: {
        logHistoryImmediate() {
            let video = this.player.el_.querySelector('video')
            //如果视频正在播放
            if (video.readyState > 3) {
                //记录一下page
                HISTORY_API.save({
                    userId: this.userId,
                    itemId: this.videoId,
                    groupId: this.courseId,
                    type: SEARCH_TYPE.VIDEO,
                    info: JSON.stringify({
                        currentTime: this.player.currentTime(),
                        courseTitle: this.courseTitle,
                        videoName: this.curVideo.name,
                        link: this.$route.query.link
                    })
                })
            } else {
                clearInterval(this.historyTimer)
            }
        },
        //记录历史记录
        logHistory() {
            clearInterval(this.historyTimer)

            this.historyTimer = setInterval(async () => {
                let video = this.player.el_.querySelector('video')
                //如果视频正在播放
                if (!video.paused && video.readyState > 3) {
                    //记录一下page
                    await HISTORY_API.save({
                        userId: this.userId,
                        itemId: this.videoId,
                        groupId: this.courseId,
                        type: SEARCH_TYPE.VIDEO,
                        info: JSON.stringify({
                            currentTime: this.player.currentTime(),
                            courseTitle: this.courseTitle,
                            videoName: this.curVideo.name,
                            link: this.$route.query.link
                        })
                    })
                } else {
                    clearInterval(this.historyTimer)
                }
            }, 10 * 1000)
        },
        //显示历史记录
        async showHistory() {
            const res = await HISTORY_API.query({
                userId: this.userId,
                groupId: this.courseId
            })
            this.videoHistoryList = res.data
            const recent = res.data[0]
            if (!recent) return
            if (recent.itemId == this.videoId) {
                //  上次播放的就是这个，跳转到对应的时长
                console.log('上次播放的就是这个!')
            } else {
                const cur = this.units[0].list.find(
                    item => String(item.id) === String(recent.itemId)
                )
                const h = this.$createElement
                Notification({
                    title: '温馨提示',
                    duration: 4000,
                    message: h(
                        'div',
                        {
                            class: 'history-notice'
                        },
                        [
                            h('p', [
                                '上次播放：',
                                h(
                                    'a',
                                    {
                                        on: {
                                            click: () => {
                                                this.selectVideo(cur)
                                            }
                                        }
                                    },
                                    JSON.parse(recent.info).videoName
                                )
                            ]),
                            h('p', ['播放时间：' + recent.updateTime])
                        ]
                    )
                })
            }
        },
        //    跳转至历史播放时间
        jumpToHistoryTime() {
            //    跳转时间播放
            // 如果url中有currentTime参数，根据参数跳转
            let currentTime = this.$route.query.currentTime
            if (currentTime) {
                currentTime
                console.log('currentTime', currentTime)
                eventBus.$emit('show-history', {
                    currentTime
                })
                this.player.currentTime(currentTime)
                return
            }
            // 跳转到上次播放的位置
            const item = this.videoHistoryList.find(
                item => item.itemId == this.videoId
            )
            if (item) {
                try {
                    let currentTime = JSON.parse(item.info).currentTime
                    //减去5s
                    currentTime = currentTime - 5
                    if (currentTime < 0) currentTime = 0
                    this.player.currentTime(currentTime)
                    eventBus.$emit('show-history', {
                        currentTime
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        }
    },
    created() {
        clearInterval(this.historyTimer)
    },
    destroyed() {
        clearInterval(this.historyTimer)
    }
}
// var vm = new Vue({
//     created: function () { console.log(2) },
//     mixins: [mixin]
// })
// // => 1
// // => 2
