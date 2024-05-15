<template>
    <section class="piano-book">
        <aside>
            <el-tree
                node-key="id"
                :default-expanded-keys="expandKeys"
                :data="catalogList"
                @node-click="handleNodeClick"
            />
        </aside>
        <section class="piano-content">
            <el-tabs v-model="curTab">
                <!--                翻译-->
                <el-tab-pane label="translate" name="mix">
                    <piano-translate
                        :en-content="enContent"
                        :content="mixContent"
                    ></piano-translate>
                </el-tab-pane>
                <!--                英文内容-->
                <el-tab-pane label="english" name="en">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 10, maxRows: 30 }"
                        v-model="enContent"
                    ></el-input>
                    <el-button @click="submitEnContent">提交</el-button>
                </el-tab-pane>
            </el-tabs>
        </section>
    </section>
</template>

<script>
import { AddCatalog, GetCatalogList, UpdateCatalog } from '../../../api/catalog'
import { Tree, Tabs, TabPane } from 'element-ui'
import { AddArticle, GetArticle, UpdateArticle } from '../../../api/article'
import PianoTranslate from './piano-translate'

function buildTree(list, id = -1) {
    return list
        .filter(item => item.upper === id)
        .map(item => {
            const children = buildTree(list, item.id)
            if (children.length > 0) {
                return { ...item, children }
            }
            return item
        })
}

export default {
    name: 'piano-book',
    components: {
        PianoTranslate,
        [Tree.name]: Tree,
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane
    },
    data() {
        return {
            catalogList: [],
            expandKeys: [1, 6],
            catalogId: 0,
            enContent: '',
            mixContent: [],
            articleId: 0,
            curTab: 'mix'
        }
    },
    computed: {},
    watch: {
        '$route.query': {
            immediate: true,
            handler(val) {
                // {catalogId: '3', articleId: '9'}
                this.handleRouteParams(val)
            }
        }
    },
    methods: {
        /* ====================== *
         *    menu菜单操作
         * ====================== */
        async fetchMenu() {
            const res = await GetCatalogList()
            this.catalogList = buildTree(
                res.data.map(item => ({
                    ...item,
                    label: item.name
                }))
            )
        },
        async handleNodeClick(arg) {
            //跳转路由，其余逻辑改为监听路由进行处理
            this.$router.push({
                query: {
                    catalogId: arg.id,
                    articleId: arg.articleid
                }
            })
        },
        async handleRouteParams(arg) {
            if (!arg.catalogId) {
                //默认请求第一个
                //这个时候menu数据可能未请求好
                return
            }
            if (arg.catalogId) {
                arg.catalogId = parseInt(arg.catalogId)
            }
            if (arg.articleId) {
                arg.articleId = parseInt(arg.articleId)
            }
            //    处理路由参数
            this.catalogId = arg.catalogId
            if (arg.articleId) {
                //存在articleId
                console.log('存在数据，直接获取并渲染')
                const res = await GetArticle(arg.articleId)

                const { id, encontent, mixcontent } = res.data[0]
                this.enContent = encontent
                this.mixContent = JSON.parse(mixcontent)
                this.articleId = id
            } else {
                console.log('新建')
                //新建个article,并更新
                const res = await AddArticle({
                    catalogid: this.catalogId,
                    encontent: '',
                    chcontent: '',
                    mixcontent: '[]'
                })
                this.articleId = res.data
                if (res.code === 2000) {
                    const uRes = await UpdateCatalog({
                        id: this.catalogId,
                        articleid: this.articleId
                    })
                    if (uRes.code === 2000) {
                        this.fetchMenu()
                    }
                }
            }
        },
        /* ====================== *
         *    文章操作
         * ====================== */
        async submitEnContent() {
            UpdateArticle({
                id: this.articleId,
                encontent: this.enContent
            })
        }
    },
    created() {
        this.fetchMenu()
    }
}
</script>

<style lang="scss">
.piano-book {
    display: flex;
    height: 100vh;

    > aside {
        width: 500px;
        height: 100%;
    }

    .piano-content {
        flex: 1;
        padding: 20px;
        height: 100vh;
        overflow-y: auto;
    }

    //    覆盖el-tree的样式
    .el-tree {
        color: #fff;
        background: #111;
    }

    .el-tree-node__content:hover {
        background: #000;
    }

    .el-tree-node:focus > .el-tree-node__content {
        background: #000;
    }
}

//.piano-paragraph {
//    display: flex;
//    flex-wrap: wrap;
//    width: 800px;
//    font-size: 24px;
//
//    div {
//        margin-right: 5px;
//        margin-bottom: 16px;
//        position: relative;
//
//        .ch {
//            position: absolute;
//            font-size: 12px;
//            white-space: nowrap;
//            left: 2px;
//            bottom: 0;
//            margin-bottom: -20px;
//            font-weight: 500;
//        }
//    }
//}
</style>
