<template>
    <el-popover v-model="visible">
        <div class="add-video-wrapper">
            <p>链接：</p>
            <el-input v-model="link"></el-input>
            <p>标签：</p>
            <!--          一级分类-->
            <el-select
                style="margin-right: 10px;width:120px"
                v-model="type"
                placeholder="请选择"
            >
                <el-option
                    v-for="item in videoCategory"
                    :key="item.name"
                    :label="item.label"
                    :value="item.name"
                >
                </el-option>
            </el-select>
            <!--          二级分类-->
            <el-select
                v-if="secondCategory.length"
                style="width:120px"
                v-model="type2"
                placeholder="请选择"
            >
                <el-option
                    v-for="item in secondCategory"
                    :key="item.name"
                    :label="item.label"
                    :value="item.name"
                >
                </el-option>
            </el-select>
            <p>来源：</p>
            <el-select style="width: 100px" v-model="from" placeholder="请选择">
                <el-option
                    v-for="item in fromCategory"
                    :key="item.name"
                    :label="item.label"
                    :value="item.name"
                >
                </el-option>
            </el-select>
            <p style="padding-top:10px;display: flex;justify-content: flex-end">
                <el-button
                    size="mini"
                    type="primary"
                    plain
                    :loading="loading"
                    @click="addVideo"
                    >添加
                </el-button>
            </p>
        </div>
        <span slot="reference" class="operate-item">添加</span>
    </el-popover>
</template>

<script>
import {
    secondCategory,
    videoCategory
} from '../../../../data/video/video-list'
import { WATCH_API } from '../../../../api/watch'

export default {
    name: 'add-video',
    props: {
        activeCategory: String,
        activeSecondCategory: String
    },
    data() {
        return {
            link: '',
            type: 'letter',
            type2: '',
            from: 'bb',
            videoCategory: videoCategory,
            loading: false,
            visible: false,
            fromCategory: [
                { name: 'bb', label: 'blibli' },
                { name: 'acfun', label: 'acfun' }
            ]
        }
    },
    computed: {
        secondCategory() {
            return secondCategory.filter(item => item.parent === this.type)
        }
    },
    watch: {
        link(src) {
            if (src.includes('blibli')) {
                this.from = 'bb'
            } else if (src.includes('acfun')) {
                this.from = 'acfun'
            }
        },
        // '$route.query.category': {
        //     immediate: true,
        //     handler(category) {
        //         if (category) {
        //             this.type = category
        //         }
        //     }
        // },
        // secondCategory: {
        //     immediate: true,
        //     handler() {
        //         if (this.secondCategory.length > 0) {
        //             this.type2 = this.secondCategory[0].name
        //         }
        //     }
        // },
        activeCategory: {
            immediate: true,
            handler() {
                this.type = this.activeCategory
            }
        },
        activeSecondCategory: {
            immediate: true,
            handler() {
                this.type2 = this.activeSecondCategory
            }
        }
    },
    methods: {
        async addVideo() {
            this.loading = true
            //提取https链接(去除中文和特殊符号)
            this.link = this.link.match(
                /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
            )[0]
            let link = this.link.split('?')[0]
            if (link.endsWith('/')) {
                link = link.slice(0, link.length - 1)
            }
            try {
                let link = this.link
                if (!link.includes('sid=')) {
                    link = this.link.split('?')[0]
                }
                const res = await WATCH_API.addBBVideo({
                    link,
                    type: this.type,
                    from: this.from,
                    type2: this.type2
                })
                this.loading = false
                if (res.code === 2000) {
                    this.$Message.success('添加成功')
                    this.$emit('upload-success', { type: this.type })
                    this.link = ''
                }
            } catch (e) {
                this.$Message.error('添加失败')
                this.loading = false
            }
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.add-video-wrapper {
    p {
        margin-top: 10px;
        margin-bottom: 10px;
    }
}

.operate-item {
    cursor: pointer;

    &:hover {
        color: $--color-primary;
    }
}
</style>
