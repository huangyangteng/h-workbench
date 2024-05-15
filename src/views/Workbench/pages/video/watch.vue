<template>
    <section class="watch-wrapper">
        <watch-nav
            :video-title="videoTitle"
            :course-title="courseTitle"
        ></watch-nav>
        <section class="watch-container">
            <section class="play-container" :style="videoStyle">
                <wave v-show="pageLoading"></wave>
                <video-player
                    id="video-player"
                    ref="videoPlayer"
                    class="video-player vjs-custom-skin"
                    :options="playerOptions"
                    :events="events"
                    @ready="playerIsReady"
                    @play="onPlay"
                    @pause="onPause"
                    @ended="onEnded"
                    @error="onError"
                    @ratechange="onRateChange"
                    @volumechange="volumeChange"
                ></video-player>

                <video-history></video-history>
            </section>
            <!--            侧边栏-->
            <aside v-show="showAside" class="outline-list">
                <i
                    style="margin-left: 8px"
                    @click="showOutline = !showOutline"
                    class="el-icon-s-operation"
                />
                <div class="video-op">
                    <el-button
                        @click="seek(-1)"
                        type="primary"
                        plain
                        size="small"
                        >快退
                    </el-button>
                    <el-input
                        style="width: 40px;margin:0 8px"
                        size="small"
                        v-model="seekStep"
                    ></el-input>
                    <el-button
                        @click="seek(1)"
                        type="primary"
                        plain
                        size="small"
                        >快进
                    </el-button>
                    <el-button
                        @click="controlPlay"
                        type="primary"
                        plain
                        size="small"
                        >{{ playText }}
                    </el-button>
                </div>

                <outline-list
                    :active="videoId"
                    v-show="showOutline"
                    :units="units"
                    @on-change="selectVideo"
                ></outline-list>
                <note-list
                    :notes="notes"
                    @change="handleNote"
                    v-show="!showOutline"
                ></note-list>
            </aside>
        </section>
        <section class="watch-mobile-info">
            <outline-list
                class="mobile-outline"
                :active="videoId"
                v-if="showOutline"
                :units="units"
                @on-change="selectVideo"
            ></outline-list>
        </section>
        <div style="display: none">
            <button id="next-btn" @click="playNextVideo">下一个</button>
        </div>
    </section>
</template>

<script>
import './watch.scss'
import { videoPlayer } from 'vue-video-player'
import {
    getNextVideo,
    getPrevVideo,
    getExt,
    isVideo,
    download
} from '../../../../tools/watch-tools'
import videojs from 'video.js'
//需要引入videojs并绑定到window上
window.videojs = videojs
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
require('videojs-contrib-hls/dist/videojs-contrib-hls.js')
import 'videojs-hotkeys'
import OutlineList from '../../components/video/outline-list'
import NoteList from '../../components/video/note-list'
import { mapState, mapMutations, mapGetters } from 'vuex'
import Wave from '../../../../components/loading/wave'
import VideoHistory from '../../components/video/video-history'
import WatchNav from './watch-nav'
import { WatchHistory } from './watch-history'
import { WatchNote } from './watch-note'
import { FetchCourse } from './fetch-course'
import { getNow } from '../../../../tools'

export default {
    name: 'watch',
    mixins: [WatchHistory, WatchNote, FetchCourse],
    components: {
        WatchNav,
        VideoHistory,
        Wave,
        videoPlayer,
        OutlineList,
        NoteList
    },
    data() {
        return {
            playerOptions: {
                //播放器配置
                autoplay: false,
                height: '720',
                playbackRates: [0.7, 1.0, 1.25, 1.5, 1.75, 2.0, 2.2, 2.5, 3],
                sources: [
                    {
                        withCredentials: false,
                        type: 'video/mp4',
                        src: null
                    }
                ]
            },
            showAside: true, //侧边栏是否显示
            showOutline: true, //显示大纲视图
            nextTimer: 0, //播放下一个的倒计时
            pageLoading: true,
            spareSrc: [],
            events: ['ratechange', 'volumechange'],
            seekStep: 3,
            playText: '播放'
        }
    },
    computed: {
        ...mapState('watch', ['history']),
        ...mapGetters('user', ['userId']),
        ...mapState('watch', {
            playNext: state => state.config.playNext,
            playbackRate: state => state.config.playbackRate,
            volume: state => state.config.volume
        }),
        player() {
            return this.$refs.videoPlayer.player
        },
        videoStyle() {
            if (this.showAside) {
                return {}
            } else {
                return {
                    width: '100%',
                    height: `calc(100vh - 45px)`,
                    marginTop: 0,
                    margin: 'auto'
                }
            }
        },
        videoInfoStyle() {
            if (this.showAside) {
                return {}
            } else {
                return {
                    padding: '0 100px'
                }
            }
        }
    },
    watch: {
        videoSize() {
            this.playerOptions.height = this.videoSize.height
        }
    },
    methods: {
        disabledDbClickFullScreenEvent() {
            let video = document.querySelector('#video-player video')
            video.ondblclick = function(e) {
                e.preventDefault()
                e.stopPropagation()
                return false
            }
        },
        controlPlay() {
            if (this.player.paused()) {
                this.playText = '暂停'

                this.player.play()
            } else {
                this.playText = '播放'
                this.player.pause()
            }
        },
        seek(flag) {
            console.log('🏀🏀🏀', this.player.currentTime())
            let curTime = this.player.currentTime()

            if (flag > 0) {
                //快进
                curTime = curTime + this.seekStep
                this.player.currentTime(curTime)
            } else {
                curTime = curTime - this.seekStep
                if (curTime < 0) {
                    curTime = 0
                }
                this.player.currentTime(curTime)
            }
            // this.player
        },
        onRateChange() {
            this.$store.commit('watch/setConfig', {
                playbackRate: this.player.playbackRate()
            })
        },
        volumeChange() {
            this.$store.commit('watch/setConfig', {
                volume: this.player.volume()
            })
        },
        onError(e) {
            console.log(e, 'error')
        },
        toBB() {
            window.open(this.$route.query.link, '_blank')
        },

        expand() {
            this.showAside = !this.showAside
        },

        playVideo(src = null, autoplay = false) {
            if (!src) {
                src = this.curVideo.src
            }
            //本地视频是相对路径，所以要添加origin才能播放
            if (!src.includes('http')) {
                src = window.location.origin + '/' + src
            }
            //播放m3u8格式的视频，需要指定type
            if (getExt(src).includes('m3u8')) {
                this.playerOptions.sources[0].type = 'application/x-mpegURL'
            }

            this.playerOptions.sources[0].src = src
            if (autoplay) {
                this.playerOptions.autoplay = true
            }
            // 设置title
            document.title = this.curVideo.name
            //隐藏loading
            setTimeout(() => {
                this.pageLoading = false
            }, 1000)

            this.fetchNotes()
        },
        playerIsReady(player) {
            //设置ios不全屏
            try {
                this.player.el_.firstChild.playsInline = true
            } catch (e) {
                console.log(e)
            }

            this.insertElement()

            this.jumpToHistoryTime()

            this.applyConfig()

            //设置快捷键
            player.hotkeys({
                enableVolumeScroll: false,
                seekStep: 5,
                enableModifiersForNumbers: false,
                captureDocumentHotkeys: true,
                documentHotkeysFocusElementFilter: e =>
                    e.tagName.toLowerCase() === 'body'
            })
            this.disabledDbClickFullScreenEvent()
        },
        applyConfig() {
            if (this.playbackRate) {
                this.player.playbackRate(this.playbackRate)
            }
            if (this.volume) {
                this.player.volume(this.volume)
            }
        },
        toHome() {
            this.$router.push({
                path: '/workbench/video',
                query: {
                    category: this.$route.query.category
                }
            })
        },
        onEnded() {
            // 播放下一个
            if (!this.playNext) return
            this.playNextVideo()
        },
        playNextVideo() {
            const isLocal = !this.isBB && !this.isAcfun
            const nextVideo = getNextVideo(this.videoId, this.units, isLocal)
            if (nextVideo) {
                this.videoId = nextVideo.id
                this.selectVideo(nextVideo)
            }
        },
        playPrevVideo() {
            const prevVideo = getPrevVideo(this.videoId, this.units)
            if (prevVideo) {
                this.videoId = prevVideo.id
                this.selectVideo(prevVideo)
            }
        },
        onPause() {
            this.logHistoryImmediate()
            clearInterval(this.historyTimer)
        },
        onPlay() {
            // 视频播放时，记录历史记录
            this.logHistory()
        },
        insertElement() {
            const isMobile = document.body.offsetWidth < 750
            if (isMobile) return
            const span = document.createElement('span')
            span.className = 'el-icon-right play-next-icon'
            span.onclick = () => {
                this.playNextVideo()
            }
            document
                .querySelector('.vjs-control-bar')
                .insertBefore(
                    span,
                    document.querySelector('.vjs-control-bar').firstChild
                        .nextSibling
                )
        }
    }
}
</script>

<style lang="scss">
.watch-menu {
    background: transparent;
}

.watch-config {
    margin-left: 40px;
}

.history-notice {
    a {
        color: $--color-primary;
        font-size: 16px;
    }

    p {
        color: #fff;
        line-height: 2;
        font-size: 12px;
    }
}

.play-next-icon {
    line-height: 42px;
    font-size: 20px;
    margin-left: 5px;
    cursor: pointer;
}

.video-op {
    padding: 10px;
}
</style>