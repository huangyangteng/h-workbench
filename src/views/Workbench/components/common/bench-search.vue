<template>
    <!--        搜索面板-->
    <div class="search-wrapper" v-show="showSearch" @click.self="reset">
        <div class="search-input">
            <el-input
                ref="searchDom"
                v-model="searchKey"
                @input="onSearch"
                prefix-icon="el-icon-search"
                placeholder="Search Something..."
                @keydown.native="onKeyDown"
                :clearable="true"
                @clear="reset"
            ></el-input>
        </div>
        <div class="search-suggest-list" v-show="suggestList.length">
            <div
                class="suggest-item"
                :class="{ active: activeIndex === index }"
                v-for="(item, index) in suggestList"
                :key="item.id"
                @click="toArticle(item)"
            >
                <i :class="getIcon(item.searchType)"></i>
                {{ item.title.slice(0, 36) }}
            </div>
        </div>
        <div class="search-list" v-show="suggestList.length"></div>
    </div>
</template>

<script>
import { searchEverything } from '@/tools/search'
import { SEARCH_TYPE } from '@/data/search'
import { getColumns } from '@/api/column'
import { getVideoList } from '@/api/watch'
import thinkingRoutes from '@/views/thinking/index'

const formatPage = page => {
    return Object.assign(page, {
        title: page.name,
        title_pinyin: page.name,
        searchType: SEARCH_TYPE.PAGE
    })
}

export default {
    name: 'bench-search',
    props: {
        showSearch: Boolean
    },
    data() {
        return {
            searchKey: '',
            suggestList: [], //建议列表
            activeIndex: -1, //搜索当前选中item索引
            findList: [], //查找结果列表,
            // 数据源
            columns: [],
            videos: [],
            pages: []
        }
    },
    computed: {},
    methods: {
        close() {
            this.$emit('close')
        },
        focus() {
            this.$refs.searchDom.focus()
        },
        reset() {
            this.close()
            this.searchKey = ''
            this.suggestList = []
            this.activeIndex = -1
        },
        onSearch() {
            const result = searchEverything(this.searchKey, {
                columns: this.columns,
                videos: this.videos,
                pages: this.pages
            })
            this.suggestList = Array.isArray(result) ? result : []
        },
        toArticle(item) {
            const { searchType } = item
            const map = {
                [SEARCH_TYPE.COLUMN]: column => {
                    this.$router.push({
                        name: 'read',
                        params: {
                            column: column.id
                        }
                    })
                },
                [SEARCH_TYPE.VIDEO]: video => {
                    if (video.bid) {
                        this.$router.push({
                            name: 'watch',
                            params: {
                                id: video.bid
                            },
                            query: {
                                category: this.activeCategory,
                                link: video.link,
                                type: video.from === 'bb' ? 'bb' : 'acfun'
                            }
                        })
                    } else {
                        this.$router.push({
                            name: 'watch',
                            params: {
                                id: video.id
                            },
                            query: {
                                category: this.activeCategory
                            }
                        })
                    }
                },
                [SEARCH_TYPE.PAGE]: page => {
                    this.$router.push({
                        name: page.name
                    })
                }
            }
            map[searchType](item)
        },
        onKeyDown(e) {
            // 下键40 上键38 enter 13
            if (e.keyCode === 38) {
                //按上
                this.activeIndex--
                if (this.activeIndex < 0) {
                    this.activeIndex = 0
                }
            } else if (e.keyCode === 40) {
                //按下
                this.activeIndex++
                if (this.activeIndex > this.suggestList.length - 1) {
                    this.activeIndex = this.suggestList.length - 1
                }
            } else if (e.keyCode == 13) {
                //回车
                if (this.activeIndex !== -1) {
                    const item = this.suggestList[this.activeIndex]
                    this.toArticle(item)
                }
            }
        },
        initData() {
            getColumns().then(res => {
                if (res.code === 2000) {
                    this.columns = res.data
                }
            })
            getVideoList().then(res => {
                if (res.code === 2000) {
                    this.videos = res.data
                }
            })
            this.pages = thinkingRoutes.map(formatPage)
        },
        getIcon(type) {
            switch (type) {
                case SEARCH_TYPE.COLUMN:
                    return 'el-icon-folder'
                case SEARCH_TYPE.VIDEO:
                    return 'el-icon-video-camera'
                case SEARCH_TYPE.PAGE:
                    return 'el-icon-paperclip'
                default:
                    return ''
            }
        }
    },
    created() {
        this.initData()
    }
}
</script>

<style lang="scss" scoped>
.search-wrapper {
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;

    .search-input {
        width: 600px;
        margin: 0px auto;
        line-height: 48px;
        height: 48px;
        //padding-left: 10px;
    }

    .search-suggest-list {
        width: 600px;
        margin: 0px auto;
        min-height: 400px;
        background: #17181a;
        border-radius: 8px;
        margin-top: 20px;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
        padding: 12px 0;
    }

    .suggest-item {
        padding: 0 24px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        transition: 0.3s background-color;
        cursor: pointer;
    }

    .suggest-item:hover,
    .suggest-item.active {
        background: #2b2b2b;
    }
}

@media (max-width: 750px) {
    .search-wrapper {
        .search-input {
            transform: translateX(10px);
            width: 303px;
        }

        .search-suggest-list {
            width: 350px;
        }
    }
}
</style>