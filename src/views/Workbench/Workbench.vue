<template>
    <section class="bench-layout animate__animated animate__fadeIn">
        <bench-header @focus="onFocus"></bench-header>
        <section
            class="bench-wrapper"
            :style="{ filter: showBlur ? 'blur(5px)' : 'none' }"
        >
            <bench-sidebar></bench-sidebar>
            <section class="bench-content">
                <router-view></router-view>
            </section>
            <footer
                style="position: absolute;bottom:1px;text-align: center;width:100%"
            >
                <a
                    style="color:#fafafa;font-size:12px;opacity: 0.5"
                    href="https://beian.miit.gov.cn/"
                    target="_blank"
                    >蜀ICP备2021027437号-1</a
                >
            </footer>
        </section>
        <bench-search ref="searchDom" :show-search="showSearch" @close="showSearch=false"/>
        <menu-overlay></menu-overlay>
    </section>
</template>

<script>
import './bench.scss'
import BenchSidebar from './layout/bench-sidebar'
import BenchHeader from './layout/bench-header'
import { searchEverything } from '../../tools/search'
import { SEARCH_TYPE } from '../../data/search'
// import BingDunDun from '../../components/lazy-panda/LazyPanda'
import MenuOverlay from './layout/menu-overlay'
import { eventBus } from '../../tools'
import BenchSearch from "@/views/Workbench/components/common/bench-search.vue";

export default {
    name: 'Workbench',
    components: {
        BenchSearch,
        MenuOverlay,
        // BingDunDun,
        'bench-sidebar': BenchSidebar,
        BenchHeader
    },
    data() {
        return {
            searchKey: '',
            showSearch: false,
            suggestList: [], //建议列表
            activeIndex: -1, //搜索当前选中item索引
            findList: [], //查找结果列表,
            showMenu: false
        }
    },
    computed: {
        showBlur() {
            if (this.showSearch || this.showMenu) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        onFocus() {
            this.showSearch = true
            this.$nextTick(() => {
                this.$refs.searchDom.focus()
            })
        },

    },
    mounted() {
        document.title = '工作台'
        eventBus.$on('toggle-open', val => {
            this.showMenu = val
        })
        this.$store.dispatch('column/fetchAndSetArticleIdMap')
    }
}
</script>

<style lang="scss" scoped>
.bingdundun {
    position: fixed;
    right: 0px;
    bottom: 0px;
    margin-right: -180px;
    margin-bottom: -100px;
}


//小于750的尺寸
@media (max-width: 750px) {
    //隐藏侧边栏
    .bench-sidebar {
        display: none;
    }
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
