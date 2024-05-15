<template>
    <section
        @click="showPlayer"
        class="gk-audio-wrapper"
        :class="{ hide: hide }"
        v-if="audioSrc"
    >
        <div class="audio-controls">
            <div class="play-back" @click="changeCurrentTime('reduce')">
                <i class="el-icon-refresh-left"></i>
                <span>15</span>
            </div>
            <div class="play-icon" @click="toggleStatus">
                <div class="play-icon-bg"></div>
                <img
                    class="not-preview"
                    v-if="!isPlay"
                    src="../assets/imgs/play.png"
                    alt=""
                    srcset=""
                />
                <img
                    class="not-preview"
                    v-if="isPlay"
                    src="../assets/imgs/pause.png"
                    alt=""
                    srcset=""
                />
            </div>
            <div class="play-back" @click="changeCurrentTime('add')">
                <i class="el-icon-refresh-right"></i>
                <span>15</span>
            </div>
            <el-dropdown
                trigger="click"
                class="play-select"
                @command="chooseRate"
            >
                <span class="el-dropdown-link">
                    {{ curRateLabel
                    }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                        v-for="item in rateList"
                        :key="item.value"
                        :command="item.value"
                        >{{ item.label }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <i
                @click.stop="hidePlayer"
                style="position: absolute;right:5px"
                class="el-icon-close click-big"
            ></i>
        </div>
        <el-slider
            class="gk-play-slider"
            :value="playPercent"
            :max="duration"
            :format-tooltip="formatTooltip"
            @input="changeSlider"
            @change="stopChangeSlider"
        ></el-slider>
        <audio
            ref="audioDom"
            @canplay="initAudioInfo"
            style="display:none"
            :src="audioSrc"
        ></audio>
    </section>
</template>
<script>
/**
 * 逻辑：    播放时，进度条走  播放时，改变currentTime,percent通过currentTime计算
 *          拖动进度条，视频暂停 视频进度走
 */
import { mapGetters, mapState } from 'vuex'
import { formatDuration } from '../tools'
import { getAudio } from '../data/audio'

export default {
    data() {
        return {
            sourceBase: 'http://111.229.14.189/api/',
            rateList: [
                { value: 1.0, label: '1.0x' },
                { value: 1.25, label: '1.25x' },
                { value: 1.5, label: '1.5x' },
                { value: 1.75, label: '1.75x' },
                { value: 2, label: '2.0x' }
            ],
            duration: 0,
            curTime: 0,
            status: 'pause',
            curRate: 1.0,
            percent: 0,
            hide: false
        }
    },
    computed: {
        ...mapGetters('column', ['curArticle']),
        ...mapState('column', ['curColumn']),
        isPlay() {
            return this.status == 'play'
        },
        curRateLabel() {
            return this.rateList.find(item => item.value == this.curRate).label
        },
        audioSrc() {
            try {
                //eslint-disable-next-line
                const reg = /\_{2}((\d)+)\_{2}/
                const articleId = this.curArticle.src.match(reg)[1]
                console.log('this.curArticle.src', this.curArticle.src)
                const src = getAudio(this.curColumn.cid, articleId)
                console.log('src', src)
                return src
            } catch (error) {
                return ''
            }
        },
        playPercent() {
            return this.curTime
        }
    },
    watch: {
        audioSrc() {
            this.audioPause()
        }
    },
    methods: {
        showPlayer() {
            if (this.hide) {
                this.hide = false
            }
        },
        hidePlayer() {
            this.hide = !this.hide
        },
        calcPercent() {
            this.percent = this.curTime / this.duration
        },
        formatTooltip(val) {
            let cur = formatDuration(val)
            let total = formatDuration(this.duration)
            return cur + '/' + total
        },
        chooseRate(rate) {
            this.curRate = rate
            this.$refs.audioDom.playbackRate = rate
        },
        audioPlay() {
            this.status = 'play'
            this.$refs.audioDom.play()
        },
        audioPause() {
            this.status = 'pause'
            this.$refs.audioDom.pause()
        },
        toggleStatus() {
            if (this.isPlay) {
                this.audioPause()
            } else {
                this.audioPlay()
            }
        },
        initAudioInfo() {
            this.duration = this.$refs.audioDom.duration
        },
        changeCurrentTime(type) {
            if (type == 'add') {
                this.$refs.audioDom.currentTime += 15
            } else {
                this.$refs.audioDom.currentTime -= 15
            }
        },
        changeSlider(val) {
            if (this.isPlay) {
                return
            }

            this.curTime = val
            this.$refs.audioDom.currentTime = this.curTime
            console.log('changeSlider -> val', val)
        },
        stopChangeSlider(val) {
            console.log('stopChangeSlider -> val', val)
        }
    },
    mounted() {
        if (!this.audioSrc) return
        this.$refs.audioDom.addEventListener('timeupdate', () => {
            if (!this.$refs.audioDom) return
            if (this.isPlay) {
                this.curTime = this.$refs.audioDom.currentTime
            }
        })
    }
}
</script>
<style lang="scss" scoped>
.gk-audio-wrapper.hide {
    right: -200px;
}

.gk-audio-wrapper {
    transition: 0.6s;
    position: fixed;
    right: 10px;
    top: 70px;
    display: inline-block;
    margin-left: 20px;
    text-align: center;
    height: 60px;
    width: 200px;
    box-sizing: border-box;
    background: $component-bg-color-2;
    border: 1px solid $border-color;
    border-top: none;
    margin-bottom: 7px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    margin-right: 15px;
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 16px;

    > audio {
        outline: 0;
    }
}

.audio-controls {
    display: flex;
    align-items: center;
    position: relative;
}

.play-icon {
    margin: 0 0px 0 15px;
    width: 32px;
    height: 32px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .play-icon-bg {
        background-image: url('https://static001.geekbang.org/resource/image/0f/76/0f0963bc50f97aa1171fa81ae6e96776.jpg');
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 300px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 0;
    }

    > img {
        cursor: pointer;
        line-height: 32px;
        text-align: center;
        z-index: 2;
        color: #fff;
        top: 1px;
        left: 0px;
        font-size: 13px;
        cursor: pointer;
        width: auto !important;
    }
}

.play-back {
    width: 17px;
    height: 17px;
    margin-top: -10px;
    position: relative;
    cursor: pointer;

    > i {
        font-size: 17px;
        color: #b2b2b2;
        position: absolute;
        -webkit-transform-origin: 55.7% 50%;
        transform-origin: 55.7% 50%;
    }

    > i:hover {
        color: #888;
    }

    > span {
        olor: #b2b2b2;
        position: absolute;
        top: 1px;
        left: 3px;
        font-size: 16px;
        white-space: nowrap;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
    }
}

.play-select {
    cursor: pointer;
    position: absolute;
    right: 45px;
    font-size: 12px;
}

.gk-play-slider {
    margin-top: -8px;

    ::v-deep.el-slider__runway {
        height: 3px;
    }

    ::v-deep.el-slider__bar {
        height: 3px;
    }

    ::v-deep.el-slider__button {
        width: 10px;
        height: 10px;
        border: solid 1px #fa8919;
    }

    ::v-deep.el-slider__button-wrapper .el-tooltip {
        margin-top: -4px;
    }
}
</style>
<style></style>
