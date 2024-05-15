<template>
    <section class="video-list">
        <!--        一级分类-->
        <section class="category">
            <b style="margin-right:12px;font-weight:400">分类：</b>
            <span
                :class="{ active: item.name == activeCategory }"
                v-for="item in categories"
                :key="item.name"
                @click="selectCategory(item)"
                >{{ item.label }}</span
            >
            <template v-if="isLogin">
                <b style="margin-left:20px;margin-right:10px;font-weight:400"
                    >|
                </b>
                <add-video
                    :active-category="activeCategory"
                    :active-second-category="activeSecondCategory"
                    @upload-success="uploadSuccess"
                ></add-video>

                <span
                    v-if="!showManage"
                    class="operate-item"
                    @click="manageVideo"
                    >管理</span
                >
                <template v-else>
                    <span class="operate-item" @click="exitManage"
                        >退出管理</span
                    >
                    <update-video
                        @success="uploadSuccess"
                        :ids="selectedVideoIds"
                        :active-category="activeCategory"
                        :active-second-category="activeSecondCategory"
                    ></update-video>
                    <span
                        :style="{
                            opacity: this.selectedVideoIds.length ? 1 : 0.5
                        }"
                        class="operate-item"
                        @click="deleteVideos"
                        >删除</span
                    >
                </template>
            </template>
        </section>
        <!--      二级分类-->
        <section class="second-category" v-if="secondCategory.length">
            <span
                @click="selectSecondCategory({ name: 'all' })"
                :class="{ active: !activeSecondCategory }"
            >
                全部
            </span>
            <span
                v-for="item in secondCategory"
                :class="{ active: item.name == activeSecondCategory }"
                :key="item.name"
                @click="selectSecondCategory(item)"
                >{{ item.label }}</span
            >
        </section>
        <section class="filter-text">
            <el-input
                prefix-icon="el-icon-search"
                size="mini"
                style="width:240px"
                v-model="filterText"
                clearable
            />
        </section>
        <section class="course-list" v-loading="loading">
            <section v-if="exhibitCourse.length === 0">暂无数据</section>
            <watch-item
                v-for="item in exhibitCourse"
                :show-manage="showManage"
                :key="item.id"
                :info="item"
                :can-show="canShow(item.id)"
                @clickCheckbox="clickCheckbox"
            ></watch-item>
        </section>
    </section>
</template>

<script>
import { Checkbox } from 'element-ui'
import {
    secondCategory,
    videoCategory
} from '../../../../data/video/video-list'
import { formatSrc } from '../../../../tools/watch-tools'
import { isVideo, getExt } from '../../../../tools/index'
import { WATCH_API } from '../../../../api/watch'
import AddVideo from '../../components/video/add-video'
import { mapGetters, mapMutations } from 'vuex'
import { USER_API } from '../../../../api/user'
import { USER_MU } from '../../../../store/mutation-types'
import pinyin from 'pinyin'
import WatchItem from './watch-item'
import UpdateVideo from '../../components/video/update-video'

export default {
    name: 'watch-list',
    components: { UpdateVideo, WatchItem, AddVideo, [Checkbox.name]: Checkbox },
    data() {
        return {
            activeCategory: videoCategory[0].name,
            activeSecondCategory: '',
            categories: videoCategory,
            allSecondCategory: secondCategory,
            list: [],
            bbList: [],
            test: true,
            showManage: false,
            selectedVideoIds: [],
            loading: false,
            filterText: '',
            remainCourses: []
        }
    },
    computed: {
        ...mapGetters('user', ['videoFilter', 'userId', 'isLogin']),
        courses() {
            let local = this.list.find(
                item => item.type === this.activeCategory
            )?.list
            if (!local) {
                local = []
            }
            local = local.filter(item => !this.videoFilter.includes(item.id))

            let bb = this.bbList.filter(
                item => item.type === this.activeCategory
            )
            return bb.concat(local)
        },
        exhibitCourse() {
            //页面上显示的视频列表
            let courses = this.courses
            //根据二级分类过滤
            if (this.activeSecondCategory) {
                courses = courses.filter(item => {
                    return item.type2 === this.activeSecondCategory
                })
            }
            //根据关键词过滤
            if (this.filterText) {
                let valuesResult = courses.filter(item => {
                    let title = item.title ? item.title : item.name
                    title = title.toLowerCase()
                    return title.includes(this.filterText)
                })
                if (valuesResult.length > 0) {
                    return valuesResult
                } else {
                    const getReg = queryString => {
                        let str = '(.*?)'
                        let queryStringArr = queryString.split('')
                        let regStr = str + queryStringArr.join(str) + str
                        return RegExp(regStr, 'i')
                    }
                    const reg = getReg(this.filterText)
                    return courses.filter(item => {
                        let title = item.title ? item.title : item.name
                        //根据搜索词生成正则
                        let title_pinyin = pinyin(title, {
                            segment: true,
                            group: true,
                            style: pinyin.STYLE_NORMAL
                        })
                            .flat()
                            .join('')
                        return reg.test(title_pinyin)
                    })
                }
            } else {
                return courses
            }
        },
        secondCategory() {
            return this.allSecondCategory.filter(
                item => item.parent === this.activeCategory
            )
        }
    },
    watch: {
        '$route.query.category': {
            immediate: true,
            handler(category) {
                if (category) {
                    this.activeCategory = category
                    this.queryList()
                }
            }
        },
        '$route.query.secondCategory': {
            immediate: true,
            handler(category) {
                if (category) {
                    if (category === 'all') {
                        this.activeSecondCategory = ''
                    } else {
                        this.activeSecondCategory = category
                    }
                    // this.queryList()
                }
            }
        }
    },
    methods: {
        ...mapMutations('user', [USER_MU.SET_USER]),

        uploadSuccess({ type }) {
            //上傳成功後重新獲取數據
            this.selectCategory({ name: type })
            this.selectedVideoIds = []
        },
        async deleteVideos() {
            if (this.selectedVideoIds.length === 0) {
                this.$Message.error('请选择要删除的视频!')
                return
            }
            //本地视频的删除和数据库视频的删除分开处理
            const localIds = this.selectedVideoIds.filter(
                item => typeof item === 'string'
            )
            //本地视频处理
            if (localIds.length) {
                const localRes = await USER_API.addFilterVideo({
                    filter: localIds.join(','),
                    id: this.userId
                })
                if (localRes.code === 2000) {
                    this[USER_MU.SET_USER]({
                        filter: localRes.data.filter
                    })
                }
            }
            //数据库的视频处理
            const dbIds = this.selectedVideoIds.filter(
                item => typeof item === 'number'
            )
            if (dbIds.length) {
                await WATCH_API.deleteVideo(dbIds)
            }

            this.$Message.success('删除成功')
            this.selectedVideoIds = []
            //重新获取数据
            this.queryList()
        },
        canShow(id) {
            return this.selectedVideoIds.includes(id)
        },
        manageVideo() {
            this.showManage = !this.showManage
        },
        exitManage() {
            this.showManage = false
            this.selectedVideoIds = []
        },
        clickCheckbox(id) {
            let index = this.selectedVideoIds.findIndex(item => item == id)
            if (index !== -1) {
                //存在
                this.selectedVideoIds.splice(index, 1)
            } else {
                this.selectedVideoIds.push(id)
            }
        },
        selectCategory(item) {
            this.activeSecondCategory = ''
            if (this.$route.query.category === item.name) {
                this.queryList()
            } else {
                this.$router.push({
                    name: this.$route.name,
                    query: { category: item.name }
                })
            }
        },
        selectSecondCategory(item) {
            this.$router.push({
                name: this.$route.name,
                query: {
                    category: this.$route.query.category,
                    secondCategory: item.name
                }
            })
        },

        async queryList() {
            this.loading = true
            const bbRes = await WATCH_API.getBBVideos()
            this.bbList = bbRes.data
            this.loading = false
            // const res = await WATCH_API.getList()
            // this.loading = false
            // if (res.code == 2000) {
            //     this.list = res.data
            //     this.bbList = bbRes.data
            // }
        }
    },
    created() {
        this.queryList()
    }
}
</script>
<style lang="scss">
.el-loading-spinner .circular {
    display: block;
}

.el-loading-spinner {
    height: auto;
}

.filter-text {
    margin-top: 12px;

    input {
        border: 1px solid $color-help;
    }
}
</style>
<style lang="scss" scoped>
.video-list {
    //max-width: 1280px;
    margin: 0 auto;
    padding: 60px;
}

//小于750的尺寸
@media (max-width: 750px) {
    .video-list {
        padding: 40px 20px;
    }
}

.category {
    font-size: 18px;

    > span {
        margin-right: 12px;
        cursor: pointer;
    }

    span.active {
        display: inline-block;
        color: $--color-primary;
        font-weight: 800;
    }
}

.second-category {
    font-size: 14px;
    padding-left: 66px;
    padding-top: 10px;

    > span {
        margin-right: 12px;
        cursor: pointer;
    }

    span.active {
        display: inline-block;
        color: $--color-primary;
    }
}

.operate-item {
    cursor: pointer;

    &:hover {
        color: $--color-primary;
    }
}

.course-list {
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1em;
}
@media (max-width: 1500px) {
    .course-list {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (max-width: 1100px) {
    .course-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 500px) {
    .course-list {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>