<template>
    <section class="history-wrapper">
        <div v-if="!isLogin">
            登录之后才能记录阅读历史，请点击右上角"登录"按钮进行登录
        </div>
        <el-timeline v-else>
            <el-timeline-item
                v-for="item in histories"
                :key="item.itemId"
                :timestamp="item.readTime"
                placement="top"
            >
                <el-card>
                    <h4>{{ item.courseTitle }}</h4>
                    <p class="last-read-title" @click="toVideo(item)">
                        上次学到：{{ item.videoName }}
                    </p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </section>
</template>

<script>
import { HISTORY_API } from '../../../../api/history'
import { mapGetters } from 'vuex'
import { formatHistory } from '../../../../tools/history-tools'
import { SEARCH_TYPE } from '../../../../data/search'

export default {
    name: 'recent-video',
    data() {
        return {
            histories: []
        }
    },
    computed: {
        ...mapGetters('user', ['userId', 'isLogin'])
    },
    methods: {
        async getHistory() {
            const res = await HISTORY_API.query({
                userId: this.userId,
                type: SEARCH_TYPE.VIDEO
            })
            if (res.code === 2000) {
                this.histories = formatHistory(res.data)
            }
        },
        toVideo(item) {
            let type = item.groupId.includes('ac') ? 'acfun' : 'bb'

            let prefix =
                type === 'acfun'
                    ? 'https://www.acfun.cn/v/'
                    : 'https://www.bilibili.com/video/'
            this.$router.push({
                name: 'watch',
                params: {
                    id: item.groupId
                },
                query: {
                    videoId: item.itemId,
                    type,
                    link:
                        type === 'acfun' && item.link
                            ? item.link
                            : prefix + item.groupId,
                    currentTime: item.currentTime
                }
            })
        }
    },
    watch: {
        isLogin(login) {
            if (login) {
                this.getHistory()
            }
        }
    },
    created() {
        this.getHistory()
    }
}
</script>

<style lang="scss" scoped>
.history-wrapper {
    margin: 40px auto;
    width: 1200px;
}

.column-item {
    background: $component-bg-color;
    padding: 16px;
    width: 400px;
    border-radius: 8px;

    .column-progress {
        display: flex;
        margin: 8px 0;

        > span {
            font-size: 13px;
        }

        .el-progress {
            width: 120px;
            margin-left: 10px;
        }
    }

    p {
        opacity: 0.8;

        &:hover {
            color: $--color-primary;
            cursor: pointer;
        }
    }
}

.last-read-title {
    cursor: pointer;
    margin-top: 8px;

    &:hover {
        color: $--color-primary;
        cursor: pointer;
    }
}
</style>
