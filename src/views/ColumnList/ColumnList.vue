<template>
    <section class="column-list">
        <header class="column-path-list">
            <section
                class="tab-study-path"
                :class="{ active: item.name === activePath }"
                v-for="item in pathList"
                :key="item.name"
                @click="clickColumn(item)"
            >
                <aside>
                    <strong>{{ item.label }}</strong>
                    <span>{{ item.nums }}门课程</span>
                </aside>
                <img :src="item.img" />
            </section>
        </header>
        <main class="course-list">
            <ColumnItem
                v-for="column in selectedColumns"
                :column="column"
                :key="column.id"
            />
        </main>
    </section>
</template>
<script>
import PATH_LIST from '../../data/pathList'
import { mapState } from 'vuex'

import { getColumns } from '@/api/column'
import { getApiCache, initApiCache, setApiCache } from '@/tools/cache'
import ColumnItem from '@/views/ColumnList/ColumnItem.vue'

export default {
    name: 'ColumnList',
    components: { ColumnItem },
    data() {
        return {
            activePath: 'cs',
            columnList: []
        }
    },
    computed: {
        ...mapState('lastRead', ['lastColumnId']),
        selectedColumns() {
            return this.columnList.filter(item => item.type === this.activePath)
        },
        pathList() {
            return PATH_LIST.map(item => {
                item.nums = this.columnList.filter(
                    c => c.type === item.name
                )?.length
                return item
            })
        }
    },
    methods: {
        clickColumn(item) {
            this.$router.push({
                name: this.$route.name,
                query: { path: item.name }
            })
        },
        _getArticleId(columnId) {
            // 从历史记录中找上次阅读的id

            let lastArticle = null
            try {
                let historyList = JSON.parse(localStorage.getItem('gk-read'))[
                    'lastRead'
                ]['lastArticleList']
                let column = historyList.find(item => item.column == columnId)
                if (column) {
                    lastArticle = column.article
                }
            } catch (error) {
                console.log(error)
            }

            // 如果不存在历史记录,取第一个
            if (!lastArticle) {
                let column = this.selectedColumns.find(
                    item => item.id == columnId
                )
                const tmp = column.contents[0]
                if (Array.isArray(tmp.subList)) {
                    lastArticle = tmp.subList[0].id
                }
            }
            return lastArticle
        },
        toRead(column) {
            // let articleId = this._getArticleId(column.id)
            // console.log('articleId',articleId)
            this.$router.push({
                name: 'read',
                params: { column: column.id }
            })
            // 路由跳转到新页面
            // const openUrl = `${window.location.origin}/#/read/${columnId}/${articleId}`
            // window.open(openUrl, '_blank')
        }
    },
    async mounted() {
        initApiCache(2)
        document.title = '专栏列表'
        const cachedData = getApiCache('column')
        if (cachedData) {
            this.columnList = cachedData
            return
        }
        const res = await getColumns()
        if (res.code === 2000) {
            this.columnList = res.data
            setApiCache('column', res.data)
        }
    },
    watch: {
        '$route.query.path': {
            immediate: true,
            handler(path) {
                if (path) {
                    this.activePath = path
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.column-list {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 20px;
}

.column-path-list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5em;
}

.course-list {
    background: $component-bg-color;
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1em;
    padding: 1.2em;
    border-radius: $radius-md;
}

//小于1280
@media (max-width: 1280px) {
    .column-path-list {
        grid-template-columns: repeat(4, 1fr);
    }
    .course-list {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 1080px) {
    .column-path-list {
        grid-template-columns: repeat(2, 1fr);
    }
    .course-list {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .column-path-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 400px) {
    .course-list {
        grid-template-columns: repeat(1, 1fr);
    }
}

.tab-study-path {
    display: inline-flex;
    justify-content: space-between;
    padding: 0.5em;
    background: $component-bg-color;
    border-radius: $radius-sm;
    cursor: pointer;

    > aside {
        > strong {
            font-weight: 400;
            display: block;
            transition: 0.5s;
        }

        > span {
            font-weight: 100;
            font-size: 12px;
            padding-left: 8px;
        }
    }

    img {
        width: 36px;
        height: 36px;
    }
}

.tab-study-path:hover,
.tab-study-path.active {
    box-shadow: 0 0 5px rgba($color: #fa8919, $alpha: 0.4);

    strong {
        color: #fa8919;
    }
}
</style>
