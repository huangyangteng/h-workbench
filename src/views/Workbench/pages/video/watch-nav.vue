<template>
    <section>
        <nav class="watch-bar pc">
            <h1>
                <i
                    @click="toHome"
                    class="el-icon-arrow-left back-home-icon"
                ></i>
                <span>{{ courseTitle }}</span>
                <b>
                    /
                </b>
                {{ videoTitle }}
            </h1>
            <div class="watch-config">
                <el-switch
                    v-if="false"
                    v-model="showAside"
                    :active-value="false"
                    :inactive-value="true"
                    active-text="剧场模式"
                    style="margin-right: 20px"
                >
                </el-switch>
                <el-switch
                    v-if="false"
                    v-model="playNextConfig"
                    active-text="自动连播"
                >
                </el-switch>

                <a
                    style="margin-left: 20px;color:#fff"
                    :href="$route.query.link"
                    target="_blank"
                    >源网站</a
                >
                <a style="margin-left: 20px;color:#fff" @click="newPage"
                    >新开页面</a
                >
                <a
                    v-if="true"
                    style="margin-left: 20px;color:#fff"
                    @click="share"
                    >分享</a
                >
            </div>
        </nav>
        <nav class="watch-bar mobile">
            <span
                @click="toHome"
                class="el-icon-arrow-left back-home-icon click-big"
                style="margin-right: 10px"
            ></span>
            <b
                style="white-space: nowrap;max-width: 40vw;overflow: hidden;text-overflow: ellipsis"
            >
                {{ videoTitle }}
            </b>
            <a
                style="margin-left: 20px;color:#fff"
                :href="$route.query.link"
                target="_blank"
                >源网站</a
            >
            <!--          <el-switch v-model="playNextConfig" active-text="自动连播">-->
            <!--          </el-switch>-->
        </nav>
    </section>
</template>

<script>
import { mapState } from 'vuex'
import { copyText } from '../../../../tools'

export default {
    name: 'watch-nav',
    props: {
        videoTitle: {
            type: String
        },
        courseTitle: {
            type: String
        }
    },
    data() {
        return {
            showAside: true
        }
    },
    computed: {
        ...mapState('watch', {
            playNext: state => state.config.playNext
        }),
        playNextConfig: {
            get() {
                return this.playNext
            },
            set(val) {
                this.$store.commit('watch/setConfig', { playNext: val })
            }
        }
    },
    methods: {
        share() {
            const getParams = url => {
                let str = url.split('?')[1]
                return Object.fromEntries(new URLSearchParams(str))
            }
            const genParams = obj => {
                return Object.keys(obj)
                    .map(function(k) {
                        return (
                            encodeURIComponent(k) +
                            '=' +
                            encodeURIComponent(obj[k])
                        )
                    })
                    .join('&')
            }
            let req = getParams(window.location.href)
            req.currentTime = document
                .getElementById('video-player')
                .querySelector('video').currentTime

            let params = genParams(req)
            copyText(window.location.href.split('?')[0] + '?' + params)
            this.$Message.success('链接已复制到剪贴板')
        },
        toHome() {
            if (this.$route.query.category) {
                this.$router.push({
                    path: '/workbench/video',
                    query: {
                        category: this.$route.query.category
                    }
                })
            } else {
                this.$router.push({
                    path: '/workbench/recent-video'
                })
            }
        },
        newPage() {
            let page = this.$router.resolve({
                path: '/workbench/video',
                query: {
                    category: this.$route.query.category
                }
            })
            window.open(page.href, '_blank')
        }
    },
    created() {}
}
</script>

<style lang="" scoped></style>
