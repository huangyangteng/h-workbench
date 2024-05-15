<template>
    <el-popover v-model="visible">
        <div class="add-video-wrapper">
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
            <p style="padding-top:10px;display: flex;justify-content: flex-end">
                <el-button
                    size="mini"
                    type="primary"
                    plain
                    :loading="loading"
                    @click="updateVideo"
                    >修改
                </el-button>
            </p>
        </div>
        <span slot="reference" class="operate-item">修改</span>
    </el-popover>
</template>

<script>
import {
    secondCategory,
    videoCategory
} from '../../../../data/video/video-list'
import { WATCH_API } from '../../../../api/watch'

export default {
    name: 'update-video',
    props: {
        activeCategory: String,
        activeSecondCategory: String,
        ids: Array
    },
    data() {
        return {
            link: '',
            type: 'letter',
            type2: '',
            from: 'bb',
            videoCategory: videoCategory,
            loading: false,
            visible: false
        }
    },
    computed: {
        secondCategory() {
            return secondCategory.filter(item => item.parent === this.type)
        }
    },
    watch: {
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
        async updateVideo() {
            this.loading = true
            try {
                const res = await WATCH_API.updateVideo({
                    type: this.type,
                    type2: this.type2,
                    ids: this.ids
                })
                this.loading = false
                if (res.code === 2000) {
                    this.$Message.success('修改成功')
                    this.$emit('success', {
                        type: this.type,
                        type2: this.type2
                    })
                }
            } catch (e) {
                this.$Message.error('修改失败' + e)
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
