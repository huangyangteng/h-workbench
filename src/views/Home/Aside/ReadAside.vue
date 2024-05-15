<template>
    <aside v-show="!isFold">
        <header class="read-aside-header">
            <!--            <i-->
            <!--                @click="toggleOutlineOrMenu"-->
            <!--                class="show-outline"-->
            <!--                :class="iconType"-->
            <!--            ></i>-->
            <span>{{ showText }}</span>
            <!--            <b>-->
            <!--                <OutlineConfig v-if="!showMenu"></OutlineConfig>-->
            <!--            </b>-->
        </header>
        <transition name="fade">
            <ReadOutline v-if="!showMenu"></ReadOutline>
        </transition>
        <transition name="fade">
            <ReadContent v-if="showMenu"></ReadContent>
        </transition>
    </aside>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import ReadOutline from './ReadOutline'
// import OutlineConfig from '../Modal/OutlineConfig'
import ReadContent from './ReadContent.vue'

export default {
    components: {
        ReadOutline,
        // OutlineConfig,
        ReadContent
    },
    data() {
        return {
            config: {
                uniqueOpened: true
            },
            showMenu: true
        }
    },
    computed: {
        ...mapState('column', ['curArticleId', 'outlineList']),
        ...mapGetters('column', ['curContents', 'isFold']),
        showText() {
            return this.showMenu ? '目录' : '大纲'
        },
        iconType() {
            if (this.showMenu) {
                return {
                    'el-icon-s-fold': true
                }
            } else {
                return {
                    'el-icon-guide': true
                }
            }
        }
    },
    methods: {
        selectArticle(article) {
            let { column } = this.$route.params
            this.$router.push({ name: 'read', params: { column, article } })
        },
        toggleOutlineOrMenu() {
            this.showMenu = !this.showMenu
        }
    }
}
</script>
<style lang="scss" scoped>
$--color-primary: #fa8919;
.read-aside-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 10px;

    > i {
        cursor: pointer;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
 {
    opacity: 0;
}
</style>
