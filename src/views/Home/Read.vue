<template>
    <section class="read-wrapper">
        <ReadAside :style="asideStyle" class="read-aside"></ReadAside>
        <DragLine v-show="!isFold" @on-drag="dragAside"></DragLine>
        <section class="read-content">
            <ReadToolBar v-show="status.toolbarIsShow"></ReadToolBar>
            <ArticleContent></ArticleContent>
            <article-outline></article-outline>
        </section>
        <!--        <AudioPlayer></AudioPlayer>-->
        <i
            v-show="isFullScreen"
            @click="notFullScreen"
            class="el-icon-monitor exit-full"
        ></i>
        <PicturePreview></PicturePreview>
        <ColumnListDraw></ColumnListDraw>
    </section>
</template>
<script>
import { COLUMN_API, getOneColumn } from '../../api/column'
import ReadAside from './Aside/ReadAside'
import ReadToolBar from './Content/ReadToolBar'
import ArticleContent from './Content/ArticleContent.vue'
import PicturePreview from './Modal/PicturePreview'
import DragLine from '../../components/dragLine'
import ColumnListDraw from './Modal/ColumnListDraw'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import ArticleOutline from './Content/ArticleOutLine'

export default {
    components: {
        ArticleOutline,
        ReadAside,
        ReadToolBar,
        ArticleContent,
        PicturePreview,
        DragLine,
        ColumnListDraw
    },
    data() {
        return {
            asideWidth: 420
        }
    },
    computed: {
        ...mapState('lastRead', ['lastColumnId']),
        ...mapState('column', ['columnList', 'status']),
        ...mapGetters('column', ['isFullScreen', 'isFold']),
        asideStyle() {
            return {
                width: this.asideWidth + 10 + 'px'
            }
        }
    },
    watch: {
        $route: {
            immediate: true,
            handler(to, from) {
                const columnId = to.params.column
                const articleId = to.params.article
                if (!from) {
                    //新进入,获取所有的专栏列表
                    this.getColumn(columnId, articleId)
                } else {
                    // 如果是同一个专栏,只更新选中的文章
                    if (to.params.column === from.params.column) {
                        this.updateArticleId(to.params.article)
                    } else {
                        // 如果不是同一个专栏，更新专栏和文章
                        this.getColumn(columnId, articleId)
                    }
                }
            }
        }
    },
    methods: {
        ...mapActions('column', ['notFullScreen']),
        ...mapMutations('column', [
            'setColumnList',
            'updateColumn',
            'updateArticleId'
        ]),
        ...mapMutations('lastRead', [
            'setLastColumn',
            'setLastArticle',
            'setReadPosition'
        ]),
        formatColumn(column) {
            let list = column.articles.map(item => ({
                id: item.id,
                title: item.title
            }))
            let map = new Map()

            list.forEach((item, index) => {
                let prev = index - 1 >= 0 ? list[index - 1] : null
                let next = index + 1 <= list.length - 1 ? list[index + 1] : null
                map.set(item.id, { prev, next })
            })
            column.nextPrevMap = map
            return column
        },
        getColumn(columnId, articleId) {
            if (!columnId) return
            getOneColumn(columnId).then(res => {
                if (res.code === 2000) {
                    this.updateColumn(this.formatColumn(res.data))

                    this.$router.push({
                        name: 'read',
                        params: {
                            column: columnId,
                            article: articleId
                                ? articleId
                                : res.data.firstArticle.id
                        }
                    })
                }
            })
        },
        saveReadPosition() {
            // 记录上次阅读的位置 article:top
            let top = document.querySelector('.article-wrapper').scrollTop
            let article = this.$route.params.article
            this.setReadPosition({ article, top })
        },
        saveHistory() {
            if (this.$route.params.column) {
                this.setLastColumn(this.$route.params.column)
                this.setLastArticle({
                    column: this.$route.params.column,
                    article: this.$route.params.article
                })
            }
        },
        dragAside(left) {
            this.asideWidth = left
        }
    },
    created() {
        // 页面刷新或关闭时，储存当前阅读内容
        window.onbeforeunload = () => {
            this.saveHistory()
            this.saveReadPosition()
        }
    },
    mounted() {
        //将所有a标签的跳转设置为新开页面
    },
    beforeRouteUpdate(to, from, next) {
        this.saveReadPosition()
        next()
    },
    beforeRouteLeave(to, from, next) {
        this.saveReadPosition()
        next()
    }
}
</script>
<style lang="scss" scoped>
.read-wrapper {
    display: flex;
    height: 100%;
    overflow: hidden;
}

.read-aside {
    width: 420px;
    min-width: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid $border-color;
    height: 100%;
    position: relative;
    background: $component-bg-color-2;
}

.read-content {
    flex: 1;
    width: 100%;
}

.exit-full {
    position: fixed;
    top: 40px;
    right: 100px;
    cursor: pointer;
}

//小于750的尺寸
@media (max-width: 750px) {
    //.read-wrapper {
    //    display: -webkit-box;
    //    overflow: auto;
    //}
    //.read-content {
    //    flex: initial;
    //}
    .read-aside {
        display: none;
    }
    .jk-title {
        font-size: 1em;
    }
}
</style>
