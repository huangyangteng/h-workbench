<template>
    <section>
        <MusicCover :content="list[0]"></MusicCover>
    </section>
</template>

<script>
import MusicCover from '../../components/music/music-cover'
export default {
    name: 'music-list',
    components: {
        MusicCover
    },
    data() {
        return {
            list: [
                {
                    cover:
                        'http://111.229.14.189/gk-files/upload_b4c88023d9294b8ba5db404a6f104282.png',
                    name: '108个关键字',
                    author: '李志'
                }
            ]
        }
    },
    computed: {},
    methods: {},
    created() {}
}
</script>

<style lang="scss" scoped></style>
