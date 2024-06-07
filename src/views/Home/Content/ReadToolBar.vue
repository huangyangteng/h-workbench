<template>
    <section class="read-tool-bar">
        <i
            @click="toggleFold"
            v-show="!isFold"
            class="el-icon-s-fold fold-icon"
        ></i>
        <i
            @click="toggleFold"
            v-show="isFold"
            class="el-icon-s-unfold fold-icon"
        ></i>
        <span
            @click="toHome"
            class="el-icon-arrow-left back-home-icon"
            style="margin-right: 10px"
        ></span>
        <!-- 标题 -->
        <span class="jk-title" @click="toHome">{{ curColumnTitle }}</span>
        <i
            class="mobile-menu el-icon-s-operation"
            style="position: absolute;right:5px;font-size: 1em"
            @click="toggleMenu"
        ></i>

        <a
            style="margin-left: 20px;color:#fff"
            v-if="curColumn && curColumn.resource"
            target="_blank"
            :href="curColumn.resource"
            >课程配套资源下载</a
        >
        <a
            style="margin-left: 20px;color:#fff"
            target="_blank"
            href="/g/workbench/column"
            >新开页面</a
        >
        <a
            style="margin-left: 8px;color:#fff"
            target="_blank"
            :href="originHref"
            >源网站</a
        >
        <!-- 音频播放 -->

        <!-- 选择颜色 -->
        <aside class="toolbar-aside">
            <section class="hltr-tool">
                <div
                    v-for="color in colorList"
                    :key="color"
                    class="hltr-color"
                    :class="{ active: activeColor == color ? true : false }"
                    :style="{ background: color }"
                    @click="changeHltrColor(color)"
                ></div>
            </section>

            <section class="read-tools">
                <!--                <el-tooltip-->
                <!--                    effect="dark"-->
                <!--                    content="$&#45;&#45;color-primary信息"-->
                <!--                    placement="top"-->
                <!--                >-->
                <!--                    <i-->
                <!--                        @click="saveHighlight"-->
                <!--                        class="el-icon-collection"-->
                <!--                        style="margin-right: 10px"-->
                <!--                    ></i>-->
                <!--                </el-tooltip>-->

                <!--                <el-tooltip effect="dark" content="选课" placement="top">-->
                <!--                    <i-->
                <!--                        @click="chooseColumn"-->
                <!--                        class="el-icon-reading"-->
                <!--                        style="font-size: 16px"-->
                <!--                    ></i>-->
                <!--                </el-tooltip>-->

                <el-tooltip effect="dark" content="全屏阅读" placement="top">
                    <i
                        @click="fullScreen"
                        class="el-icon-full-screen"
                        style="margin-left: 10px;margin-right: 10px"
                    ></i>
                </el-tooltip>
                <el-tooltip effect="dark" content="返回主页" placement="top">
                    <i
                        @click="toHome"
                        class="el-icon-s-home"
                        style="margin-left: 10px;margin-right: 10px"
                    ></i>
                </el-tooltip>
            </section>
        </aside>
        <addNote v-if="false"></addNote>
    </section>
</template>
<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import addNote from './AddNote'
import { getElementTop, copyToBoard } from '../../../tools'

export default {
    components: {
        addNote
    },
    data() {
        return {
            saveTimer: null,
            colorList: ['#40392a', '#29B6F6', '#F44336'],
            hltr: null,
            activeColor: '#40392a'
        }
    },
    computed: {
        ...mapState('column', ['columnList', 'curColumn']),
        ...mapGetters('column', ['curColumnTitle', 'isFold']),
        ...mapGetters('lastRead', ['getLastArticleId']),
        originHref() {
            return (
                'https://time.geekbang.org/column/intro/' + this.curColumn.cid
            )
        }
    },
    methods: {
        ...mapMutations('column', ['toggleNavIsShow']),
        ...mapMutations('component', ['updateColumnListDraw']),
        ...mapActions('column', ['fullScreen']),
        toggleMenu() {
            this.updateColumnListDraw({ show: true })
        },
        toHome() {
            this.$router.push({ name: 'workbenchColumn' })
        },
        toggleFold() {
            this.toggleNavIsShow(this.isFold)
        },
        saveHighlight() {
            let savedHightLight = window.hltr.serializeHighlights()
            if (savedHightLight == '[]') {
                return
            }
            this.$store.commit('lastRead/saveHightLight', {
                id: this.$store.state.column.curArticleId,
                content: savedHightLight
            })
        },
        changeHltrColor(color) {
            this.activeColor = color
            this.hltr.setColor(color)
        },
        cancelHighlight(removeId) {
            let hightlightDom = document.querySelectorAll('.highlighted')
            for (let i = 0; i < hightlightDom.length; i++) {
                let curDom = hightlightDom[i]
                if (curDom.dataset['timestamp'] == removeId) {
                    window.hltr.removeHighlights(curDom)
                }
            }
        },
        copyHightlight(copyId) {
            let hightlightDom = document.querySelectorAll('.highlighted')
            let copyText = ''
            for (let i = 0; i < hightlightDom.length; i++) {
                let curDom = hightlightDom[i]
                if (curDom.dataset['timestamp'] == copyId) {
                    copyText += curDom.innerText
                }
            }
            if (copyToBoard(copyText)) {
                this.$Message({
                    type: 'success',
                    message: '复制成功'
                })
            }
        },
        bindCancelHighlight() {
            // 添加删除功能
            let articleWrapperDom = document.querySelector('.article-wrapper')
            const clickFn = e => {
                let hightLightOprateMenu = articleWrapperDom.querySelector(
                    '.hightlight-oprate'
                )
                if (!hightLightOprateMenu) return
                // 如果点击了取消
                if (e.target.className == 'hight-op-item delete') {
                    this.cancelHighlight(e.target.id)
                    hightLightOprateMenu.style.visibility = 'hidden'
                    return
                }
                // 如果点击了复制
                if (e.target.className == 'hight-op-item copy') {
                    this.copyHightlight(e.target.id)
                    hightLightOprateMenu.style.visibility = 'hidden'
                    return
                }
                if (e.target.className != 'highlighted') {
                    hightLightOprateMenu.style.visibility = 'hidden'
                    return
                }
                // 如果点击了高亮元素
                let articleWrapperWidth = articleWrapperDom.offsetWidth - 80
                //水平位置默认居中
                hightLightOprateMenu.style.left =
                    articleWrapperWidth / 2 - 113 + 'px'
                hightLightOprateMenu.style.top =
                    getElementTop(e.target) - 70 - 50 + 'px'
                // hightLightOprateMenu.style.top = e.target.offsetTop - 50 + 'px'
                hightLightOprateMenu.style.visibility = 'visible'
                // 在取消高亮按钮上设置id,用于取消高亮
                hightLightOprateMenu.querySelector('.delete').id =
                    e.target.dataset.timestamp
                // 在复制按钮上也设置id
                hightLightOprateMenu.querySelector('.copy').id =
                    e.target.dataset.timestamp
            }
            document.onmousedown=clickFn
            // document.removeEventListener('mousedown', clickFn)
            // document.addEventListener('mousedown', clickFn)
        },
        bindKeyboard() {},
        chooseColumn() {
            this.updateColumnListDraw({ show: true })
        }
    },
    mounted() {
        this.hltr = new window.TextHighlighter(
            document.querySelector('.article-wrapper')
        )
        window.hltr = this.hltr
        this.bindCancelHighlight()
        this.bindKeyboard()

        this.saveTimer = setInterval(() => {
            if (document.hidden) return
            this.saveHighlight()
        }, 10000)
    },
    beforeDestroy() {
        clearInterval(this.saveTimer)
    }
}
</script>
<style lang="scss">
.read-tool-bar {
    border-bottom: 1px solid $border-color;
    background: $component-bg-color;
    height: 66px;
    padding: 0 38px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    > i {
        cursor: pointer;
        margin-right: 25px;
        font-size: 30px;
        font-weight: 200;
    }

    > aside {
        flex: 1;
        margin-right: 20px;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        i {
            cursor: pointer;
        }
    }
}

.jk-title {
    color: $font-primary;
    font-weight: 400;
    font-size: 1.5em;
}

.icon-tip {
    color: #fa8919;
}

.hltr-tool {
    display: inline-block;
    margin-right: 20px;
}

.hltr-color {
    display: inline-block;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid #eee;
    margin-right: 10px;
}

.hltr-color.active {
    width: 30px;
    height: 30px;
    border-color: #333;
}

.read-tools {
    display: inline-block;
    height: 30px;
    line-height: 30px;
}

.highlighted {
    position: relative;
}

.mobile-menu {
    visibility: hidden;
}

//小于750的尺寸
@media (max-width: 750px) {
    .mobile-menu {
        visibility: visible;
    }
    .toolbar-aside,
    .fold-icon {
        display: none !important;
    }

    .read-tool-bar {
        padding: 0 10px;

        .back-home-icon {
            display: inline-block;
            font-size: 24px;
            margin-text-outline: -1px;
        }
    }
    .jk-title {
        font-size: 1em;
    }
}
</style>
<style lang="css">
.hightlight-oprate {
    /*visibility: visible;*/
    position: absolute;
    z-index: 10;
    font-size: 15px;
    font-weight: 300;
    height: 44px;
    background: #484848;
    color: #fff;
    line-height: 26px;
    display: flex;
    align-items: center;
    border-radius: 8px;
    /*transition: 0.5s all;*/
    visibility: hidden;
}

.hightlight-oprate::before {
    content: '';
    position: absolute;
    border-top: 6px solid #484848;
    border-right: 8px solid rgba(0, 0, 0, 0);
    border-left: 8px solid rgba(0, 0, 0, 0);
    width: 0px;
    height: 0px;
    bottom: -6px;
    left: 95px;
}

.hight-op-item {
    cursor: pointer;
    padding: 0 16px;
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hight-op-item:hover {
    background: #353535;
}

.hight-op-item:first-child {
    border-radius: 8px;
}

.hight-op-item:last-child {
    border-radius: 8px;
}
</style>
