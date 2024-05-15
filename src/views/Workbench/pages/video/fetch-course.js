import { WATCH_API } from '../../../../api/watch'
import {
    download,
    formatBBCourse,
    formatCourse,
    getAcfunPlaySrc,
    getExt,
    getSrcById,
    getVideoList,
    isVideo
} from '../../../../tools/watch-tools'
import { getParamsByUrl } from '../../../../tools'

export const FetchCourse = {
    data() {
        return {
            courseId: null, //课程id
            courseTitle: '', //课程标题
            units: [], //一个课程下面有多少单元 [{},{}]

            videoId: null, //当前播放视频id
            /**videoItem
             * cid
             * name
             * page
             * part
             */
            videoList: [] //一个course下面所有的video
        }
    },
    computed: {
        isBB() {
            return this.$route.query.type === 'bb'
        },
        isAcfun() {
            return this.$route.query.type === 'acfun'
        },
        curVideo() {
            return this.videoList.find(item => item.id == this.videoId)
        },
        videoTitle() {
            if (this.curVideo) {
                return this.curVideo.name
            } else {
                return ''
            }
        }
    },
    watch: {
        //逻辑从这里开始调用(一进入页面就会触发)：监听课程id的改变，获取数据
        '$route.params.id': {
            //课程id，根据课程id获取数据
            immediate: true,
            handler(id) {
                if (id) {
                    this.handleCourseQuery(id)
                }
            }
        },
        '$route.query.videoId': {
            immediate: false,
            handler(videoId) {
                //视频id,切换侧边栏时触发
                this.pageLoading = true
                let src
                if (this.isBB) {
                    WATCH_API.parseBBVideo({
                        collection: this.$route.query.collection,
                        bid: this.$route.params.id,
                        cid: this.$route.query.videoId,
                        p: this.$route.query.p
                    }).then(res => {
                        src = res.data.src
                        this.playVideo(src, true)
                    })
                } else if (this.isAcfun) {
                    WATCH_API.getAcfunCourse({
                        link: this.$route.query.link,
                        onlySrc: 1
                    }).then(res => {
                        src = getAcfunPlaySrc(res.data)

                        // src = res.data.src
                        this.playVideo(src, true)
                    })
                } else {
                    src = getSrcById(videoId, this.units)
                    this.playVideo(src, true)
                }
            }
        }
    },
    methods: {
        async handleCourseQuery(id) {
            this.courseId = id
            if (this.isBB) {
                await this.queryBBCourse(this.$route.query.link)
            } else if (this.isAcfun) {
                await this.queryAcfunCourse(this.$route.query.link)
            } else {
                await this.queryCourseById(id)
            }
            //  显示历史记录
            this.showHistory()
        },
        async queryCourseById(id) {
            let res = await WATCH_API.query({ courseId: id })
            if (res.code == 2000) {
                const { list, title } = res.data
                let result = formatCourse(list, title)
                this.courseTitle = title
                this.units = result
                this.videoList = getVideoList(this.units)
                if (this.units.length > 0) {
                    // 根据url参数播放视频
                    const videoId = this.$route.query.videoId
                    if (videoId) {
                        this.videoId = videoId
                    } else {
                        //如果url上没有id，播放第一个
                        this.videoId = this.videoList[0].id
                    }
                    this.playVideo()
                }
                // this.showHistory()
            }
        },
        async queryBBCourse(link) {
            //  从blibli获取视频信息
            const res = await WATCH_API.getBBCourse({
                link
            })
            if (res.code != 2000) {
                return
            }
            const { title, src, isCollection = false } = res.data
            this.courseTitle = title
            this.units = formatBBCourse(res.data)
            this.videoList = this.units[0].list
            this.videoId = this.$route.query.videoId
                ? this.$route.query.videoId
                : this.videoList[0].id
            WATCH_API.parseBBVideo({
                collection: isCollection ? 1 : 0,
                bid: this.$route.params.id,
                cid: this.videoId,
                p: getParamsByUrl('p', location.href)
            }).then(res => {
                this.playVideo(res.data.src, true)
            })
        },
        async queryAcfunCourse(link) {
            const res = await WATCH_API.getAcfunCourse({
                link
            })
            if (res.code != 2000) {
                return
            }
            const { title, src, spareSrc } = res.data
            this.spareSrc = spareSrc
            this.courseTitle = title
            this.units = formatBBCourse(res.data)
            this.videoList = this.units[0].list

            this.videoId = this.$route.query.videoId
                ? this.$route.query.videoId
                : this.videoList[0].id
            this.playVideo(getAcfunPlaySrc(res.data))
        },
        //切换视频
        selectVideo(videoItem) {
            //选中侧边栏时的操作
            const { id, src, page, isCollection } = videoItem
            this.videoId = id

            //b站的视频播放 http://localhost:8080/#/workbench/watch/BV1Mg411g7C8?type=bb&link=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1Mg411g7C8
            if (this.isBB) {
                //---------------------处理合集的逻辑
                if (isCollection) {
                    this.videoId = id
                    this.$router.push({
                        name: 'watch',
                        params: { id: this.courseId },
                        query: {
                            videoId: this.videoId,
                            link,
                            type: 'bb',
                            category: this.$route.query.category,
                            collection: 1
                        }
                    })
                    return
                }
                //处理单个的逻辑
                let link = this.$route.query.link
                if (link.includes('?') && !link.includes('p=')) {
                    link = link + `&p=${page}`
                } else {
                    link = link.split('?')[0] + `?p=${page}`
                }
                this.$router.push({
                    name: 'watch',
                    params: { id: this.courseId },
                    query: {
                        videoId: this.videoId,
                        link,
                        type: 'bb',
                        category: this.$route.query.category,
                        p: page
                    }
                })
            } else if (this.isAcfun) {
                this.$router.push({
                    name: this.$route.name,
                    params: { id: this.courseId },
                    query: {
                        videoId: this.videoId,
                        link: videoItem.link,
                        type: 'acfun',
                        category: this.$route.query.category
                    }
                })
            } else {
                //本地视频处理： 如果src后缀是视频，则播放，否则下载
                if (isVideo(getExt(src))) {
                    this.$router.push({
                        name: 'watch',
                        params: { id: this.courseId },
                        query: { videoId: this.videoId }
                    })
                } else {
                    let tmp = src.split('.')
                    tmp.pop()
                    const name = tmp.pop()
                    const link = window.location.origin + '/' + src
                    download(link, name)
                    this.$Message.success('资源下载成功!')
                }
            }
        }
    }
}
