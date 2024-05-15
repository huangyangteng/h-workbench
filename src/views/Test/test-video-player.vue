<template>
    <section>
        <video-player
            ref="videoDom"
            @play="onPlay"
            @volumechange="volumeChange"
            @error="onError"
            @ratechange="onRate"
            :options="options"
            :events="events"
        ></video-player>
    </section>
</template>

<script>
import { videoPlayer } from 'vue-video-player'

import videojs from 'video.js'
//需要引入videojs并绑定到window上
window.videojs = videojs
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
require('videojs-contrib-hls/dist/videojs-contrib-hls.js')
export default {
    name: 'test-video-player',
    components: {
        videoPlayer
    },
    data() {
        return {
            options: {
                autoplay: false,
                height: '720',
                playbackRates: [0.7, 1.0, 1.25, 1.5, 2.0],
                sources: [
                    {
                        withCredentials: false,
                        src: 'https://leexiao.site/file/1.mp4'
                    }
                ]
            },
            events: ['ratechange']
        }
    },
    methods: {
        onRate() {
            console.log('on rate')
        },
        volumeChange() {
            console.log('volume change')
        },
        onPlay() {
            console.log('play')
        }
    }
}
</script>
