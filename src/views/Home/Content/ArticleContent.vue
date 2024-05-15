<template>
    <section
        @mouseup="logMarks"
        class="article-wrapper"
        v-html="articleContent"
        ref="articalWrapper"
    ></section>
</template>
<script>
import { Loading } from 'element-ui'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { uid, copyToBoard } from '../../../tools/index'
import axios from 'axios'
import { HISTORY_API } from '../../../api/history'
import { getArticleInfo } from '@/api/column'
import { getArticleCache, addArticleCache } from '@/tools/cache'

const CancelToken = axios.CancelToken
let cancel
export default {
    data() {
        return {
            articleContent: '',
            loading: true,
            loadingInstance: null
        }
    },
    computed: {
        ...mapState('column', ['curArticleId']),
        ...mapGetters('user', ['userId']),
        ...mapGetters('column', [
            'curContents',
            'curColumnTitle',
            'curArticleTitle',
            'nextPrevMap'
        ])
    },
    methods: {
        ...mapMutations('lastRead', ['setLastColumn', 'setLastArticle']),
        ...mapMutations('column', ['updateArticleId']),
        logMarks() {
            this.$store.dispatch('lastRead/saveMarks')
        },
        async cacheNextArticle(id) {
            let { next } = this.nextPrevMap?.get(Number(id)) || {}
            // 如果不存在next返回
            if (!next) return
            // 如果已经缓存过，返回
            let { value = null } = (await getArticleCache(next.id)) || {}
            if (value) return
            const res = await getArticleInfo(next.id)
            addArticleCache(next.id, res?.data?.content)
        },
        async handlerArticle(id, top) {
            // 每次发送新的请求之前，取消上一次的请求
            this.showLoading()
            let { value: content = null } = (await getArticleCache(id)) || {}

            if (!content) {
                const res = await getArticleInfo(id)
                content = res.data.content
                addArticleCache(id, content)
            }

            this.articleContent =
                '<div class="hightlight-oprate"> <div class="hight-op-item delete">取消高亮</div> <div class="hight-op-item note">笔记</div> <div class="hight-op-item copy">复制</div> </div>' +
                this.filterWaterMark(content)

            this.hideLoading()
            this.$nextTick(() => {
                this.saveHistory()
                this.generateOutline()

                this.polyfillPage()

                document.querySelector('.article-wrapper').scrollTop = top
                this.setTitle()
                this.loadHightLight(id)
                this.bindEvent()
                this.setLinkTarget()
                this.cacheNextArticle(id)
            })
        },
        setLinkTarget() {
            Array.from(this.$refs.articalWrapper.querySelectorAll('a')).forEach(
                item => {
                    let href = item.getAttribute('href')
                    if (href && !href.includes('#')) {
                        item.setAttribute('target', '_blank')
                    }
                    // if (!item.href.startsWith('#')) {//以#开头的是锚点，用于在当前页面跳转
                    //     item.setAttribute('target', '_blank')
                    // }
                }
            )
        },
        loadHightLight(id) {
            let lastHightLight = this.$store.getters[
                'lastRead/getLastHightLight'
            ](id)
            window.hltr.deserializeHighlights(lastHightLight)
        },
        saveHightLight(id) {
            let savedHightLight = window.hltr.serializeHighlights()
            if (savedHightLight.length == 0) return
            this.$store.commit('lastRead/saveHightLight', {
                id: id,
                content: savedHightLight
            })
        },
        filterWaterMark(content) {
            //去除水印
            return content
                .replace('<p class="x">更多课程请加QQ群170701297</p>', '')
                .replace(
                    '<p class="x">所有最新极客时间课程请加QQ群170701297</p>',
                    ''
                )
                .replace(/<script.*>(.*\n)*<\/script>/gim, '')
        },
        generateOutline() {
            //生成大纲视图数据
            let wrapper = document.querySelector('.article-wrapper')
            let childrens = wrapper.getElementsByTagName('*')
            let treeArray = []

            for (let i = 0; i < childrens.length - 1; i++) {
                let nodeName = childrens[i].nodeName
                if (nodeName == 'H1' || nodeName == 'H2' || nodeName == 'H3') {
                    childrens[i].id = uid()
                    treeArray.push({
                        id: childrens[i].id,
                        name: childrens[i].innerText,
                        tag: childrens[i].nodeName,
                        top: childrens[i].offsetTop
                    })
                }
            }
            this.$store.commit('column/setOutline', treeArray)
        },
        setTitle() {
            document.title = this.curArticleTitle + '—' + this.curColumnTitle
        },
        async saveHistory() {
            if (this.$route.params.column && this.userId) {
                //记录专栏阅读历史
                const res = await HISTORY_API.save({
                    userId: this.userId,
                    itemId: this.$route.params.column,
                    type: 'column',
                    info: JSON.stringify({
                        articleId: this.$route.params.article,
                        articleTitle: this.curArticleTitle,
                        columnTitle: this.curColumnTitle
                    })
                })
                //TODO:记录文章阅读历史及进度

                this.setLastColumn(this.$route.params.column)
                this.setLastArticle({
                    column: this.$route.params.column,
                    article: this.$route.params.article
                })
            }
        },
        polyfillPage() {
            let arr = document.querySelectorAll('._50pDbNcP_0')
            if (arr.length == 0) return
            let nav = null
            if (arr.length > 1) {
                nav = arr[arr.length - 1]
            } else {
                nav = arr[0]
            }
            try {
                nav.previousElementSibling.remove()
            } catch (error) {
                console.log('polyfillPage error', error)
            }
            let navDom = document.querySelector('._31dn84GH_0')
            console.log(
                '🚀 ~ file: ArticleContent.vue ~ line 141 ~ polyfillPage ~ navDom',
                navDom
            )
            if (navDom) {
                navDom.remove()
            }
        },
        showLoading() {
            let app = document.getElementById('app')
            let wrapper = document.querySelector('.article-wrapper')
            let target = app ? app : wrapper
            this.loadingInstance = Loading.service({
                // target: target,
                spinner: 'el-icon-loading',
                fullscreen: true
                // text: 'rendering...'
            })
        },
        hideLoading() {
            this.loadingInstance.close()
        },
        bindEvent() {
            // 复制代码
            try {
                Array.from(
                    document.querySelectorAll('[data-slate-type="pre"]')
                ).forEach(dom => {
                    dom.firstChild.onclick = () => {
                        let result = copyToBoard(dom.innerText)
                        if (result) {
                            this.$Message.success('复制成功!')
                        }
                    }
                })
            } catch (error) {
                console.log('bindEvent -> error', error)
            }
        }
    },
    beforeDestroy() {
        // removeListener(this.$refs.articalWrapper)
    },
    watch: {
        '$route.params.article': {
            immediate: true,
            handler(id, oldId) {
                if (!id) return
                this.updateArticleId(id)
                if (oldId) {
                    this.saveHightLight(oldId)
                }
                let top = this.$store.getters['lastRead/getLastReadPosition'](
                    id
                )
                this.$nextTick(() => {
                    this.handlerArticle(id, top)
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.article-wrapper {
    padding: 80px 40px;
    padding-left: 20%;
    padding-right: 20%;
    overflow-y: auto;
    box-sizing: border-box;
    height: 100%;
    position: relative;
    background: $component-bg-color;
}

//小于750的尺寸
@media (max-width: 750px) {
    .article-wrapper {
        padding: 10px;
        overflow-x: hidden;
    }
}

.article-wrapper #app {
}
</style>
<style lang="scss">
._3ADRghFH_0 {
    max-width: 1200px;
    margin: 0 auto;
    margin-bottom: 20px;
    font-weight: 400;
    color: #353535;
    line-height: 1.76;
    white-space: normal;
    word-break: normal;
    font-size: 17px;
    -webkit-transition: background-color 0.3s ease;
    transition: background-color 0.3s ease;

    img {
        width: 100%;
    }

    h1 {
        font-size: 21px;
    }
}

._2c4hPkl9 > div > div {
    margin: 30px 0;
}

._1qhD3bdE_0 img {
    width: 20px;
}
</style>