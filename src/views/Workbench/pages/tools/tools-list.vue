<template>
    <section class="tools-list">
        <juejin-star></juejin-star>
        <video-update></video-update>
        <add-bb-video></add-bb-video>
    </section>
</template>

<script>
import JuejinStar from '../../components/tools/juejin-star'
import VideoUpdate from '../../components/tools/video-update'
import AddBbVideo from '../../components/tools/add-bb-video'

export default {
    name: 'tools-list',
    components: { AddBbVideo, VideoUpdate, JuejinStar },
    data() {
        return {}
    },
    computed: {},
    methods: {},
    created() {}
}
</script>

<style lang="scss" scoped>
.tools-list {
    display: flex;
    flex-wrap: wrap;
}
</style>
