<template>
    <section class="test-other-link">
        <nav>
            <a
                href="javascript:;"
                @click="
                    clickLink(
                        'https://www.bilibili.com/video/BV1JZ4y1L7Dv/?spm_id_from=333.788.recommend_more_video.2'
                    )
                "
                >菜单一</a
            >
            <a href="javascript:;" @click="clickLink('https://juejin.cn/')"
                >菜单二</a
            >
        </nav>

        <iframe v-if="curLink" :src="curLink"></iframe>
    </section>
</template>

<script>
export default {
    name: 'test-other-link',
    data() {
        return {
            curLink: ''
        }
    },
    computed: {},
    watch: {
        '$route.query.redirect': {
            immediate: true,
            handler(redirect) {
                console.log('redirect', redirect)
                if (redirect) {
                    this.curLink = redirect
                }
            }
        }
    },
    methods: {
        clickLink(href) {
            console.log('click link')
            this.$router.push({
                path: this.$route.path,
                query: {
                    redirect: href
                }
            })
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.test-other-link {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100vh;

    iframe {
        height: 100%;
    }

    nav {
        height: 40px;
        padding: 10px;
    }
}
</style>
