<template>
    <section>
        <note-item v-if="false" :note="note"></note-item>
        <login-modal v-if="false"></login-modal>
        <bing-dun-dun v-if="false"></bing-dun-dun>
        <test-bdy v-if="false"></test-bdy>
        <section
            v-if="false"
            style="width: 800px;height: 600px;position: relative"
        >
            <wave v-if="false"></wave>
            <cube v-if="false"></cube>
        </section>
        <TestVideoPlayer v-if="true"></TestVideoPlayer>
        <BannerText v-if="false"></BannerText>
        <test-ios-drag v-if="false"></test-ios-drag>
        <test-vuedraggable v-if="false"></test-vuedraggable>
        <test-card-dragger v-if="false"></test-card-dragger>
        <test-bg></test-bg>
    </section>
</template>
<script>
import BingDunDun from '../../components/lazy-panda/LazyPanda'
import TestBdy from './test-bdy'
import Wave from '../../components/loading/wave'
import Cube from '../../components/loading/cube'
import TestVideoPlayer from './test-video-player'
import LoginModal from '../Workbench/components/common/login-modal'
import NoteItem from '../Workbench/components/video/note-item'
import BannerText from '../../components/BannerText'
import TestIosDrag from './test-ios-drag'
import TestVuedraggable from './test-vuedraggable'
import TestCardDragger from './TestCardDragger'
import TestBg from './test-bg'

export default {
    components: {
        TestBg,
        TestCardDragger,
        TestVuedraggable,
        TestIosDrag,
        BannerText,
        NoteItem,
        LoginModal,
        Cube,
        Wave,
        TestBdy,
        BingDunDun,
        TestVideoPlayer
    },
    data() {
        return {
            note: {
                value: `<a href="https://www.bilibili.com/video/BV1164y1y7gx" target="_blank">测试链接</a>`,
                date: '2022-10-10 12:00:00'
            }
        }
    },
    computed: {},
    mounted() {}
}
</script>
<style lang="scss" scoped>
.box {
    width: 300px;
    height: 300px;
    background-color: #ccc;
}

.mouse-follow {
    // display: none;
    border: 1px solid #fff;
    position: fixed;
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
    margin: -15px 0 0 -15px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    // transition: 0.4s;
}
</style>
