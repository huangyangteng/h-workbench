<template>
    <div class="video-history" v-if="show">
        已为您定位至 {{ showCurrentTime }}
    </div>
</template>

<script>
import { eventBus, formatDuration } from '../../../../tools'
import { Notification } from 'element-ui'

export default {
    name: 'video-history',
    data() {
        return {
            currentTime: 0,
            show: false,
            timer: 0
        }
    },
    computed: {
        showCurrentTime() {
            return formatDuration(this.currentTime)
        }
    },

    mounted() {
        // Notification.info('哈哈哈哈哈')
        /**
         * 1. 如果是从watch-list点进来，需要跳转播放（或者弹出提示）
         * 2. 目录已经看过的需要标识一下吗
         * 3. 一个courses的历史记录是否需要全局记录
         */
        //历史记录功能：目录，已经播放过的标识一下，
        eventBus.$on('show-history', ({ currentTime }) => {
            clearTimeout(this.timer)
            this.currentTime = currentTime
            this.show = true
            this.timer = setTimeout(() => {
                this.show = false
            }, 3000)
        })
    }
}
</script>

<style lang="scss" scoped>
.video-history {
    background: #333;
    padding: 5px 10px;
    font-size: 12px;
    position: absolute;
    border-radius: 5px;
    bottom: 5%;
    left: 20px;
    color: $--color-primary;
}
</style>
