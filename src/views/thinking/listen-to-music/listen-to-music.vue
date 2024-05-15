<template>
    <section>
        <audio
            v-show="false"
            controls
            src="https://esd2a2b8c2gu.prissl.qiqiuyun.net/coursematerial-228/20180316020135-k73j4u3cmdscg0cg?e=1659161938&token=ExRD5wolmUnwwITVeSEXDQXizfxTRp7vnaMKJbO-:9UcS5acb2IOM_WqHzg4_XmYgV2E="
        ></audio>
        <h1 style="padding-left: 30px;font-size: 120px">
            {{ showCur }}
        </h1>

        <!--        <video-->
        <!--            ref="video"-->
        <!--            @timeupdate="onTimeUpdate"-->
        <!--            controls-->
        <!--            src="../../../assets/video/young.mp4"-->
        <!--        ></video>-->
    </section>
</template>

<script>
import { formatDuration } from '../../../tools'

export default {
    name: 'listen-to-music',
    data() {
        return {
            curTime: 0,
            description: [{ time: '3:00', desc: '钢琴演奏带重复音的旋律' }]
        }
    },
    computed: {
        showCur() {
            return formatDuration(this.curTime)
        }
    },
    methods: {
        onTimeUpdate() {
            this.curTime = this.$refs.video.currentTime
        }
    },
    created() {}
}
</script>

<style lang="" scoped></style>
