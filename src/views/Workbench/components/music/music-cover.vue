<template>
    <section class="music-cover">
        <img :src="content.cover" alt="" srcset="" />
        <p>{{ content.name }}</p>
    </section>
</template>

<script>
export default {
    name: 'music-cover',
    props: {
        content: {
            type: Object,
            default: () => {
                return {
                    cover:
                        'http://111.229.14.189/gk-files/upload_b4c88023d9294b8ba5db404a6f104282.png',
                    name: '108个关键字',
                    author: '李志'
                }
            }
        }
    },
    data() {
        return {}
    },
    computed: {},
    methods: {},
    created() {}
}
</script>

<style lang="scss" scoped>
.music-cover {
    width: 200px;
    border-radius: 5px;
    img {
        width: 200px;
        height: 200px;
        object-fit: cover;
    }
}
</style>
