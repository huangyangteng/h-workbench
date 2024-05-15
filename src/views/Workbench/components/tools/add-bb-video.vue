<template>
    <tools-item name="添加视频">
        <p>链接：</p>
        <el-input v-model="link"></el-input>
        <p>分类：</p>
        <el-select v-model="type" placeholder="请选择">
            <el-option
                v-for="item in videoCategory"
                :key="item.name"
                :label="item.label"
                :value="item.name"
            >
            </el-option>
        </el-select>
        <p></p>
        <el-button :loading="loading" @click="addVideo">添加</el-button>
    </tools-item>
</template>

<script>
import ToolsItem from './tools-item'
import { videoCategory } from '../../../../data/video/video-list'
import { WATCH_API } from '../../../../api/watch'

export default {
    name: 'add-bb-video',
    components: { ToolsItem },
    data() {
        return {
            link: '',
            type: 'letter',
            videoCategory: videoCategory,
            loading: false
        }
    },
    computed: {},
    methods: {
        async addVideo() {
            this.loading = true
            const res = await WATCH_API.addBBVideo({
                link: this.link.split('?')[0],
                type: this.type
            })
            this.loading = false
            if (res.code === 2000) {
                this.$Message.success('添加成功')
                this.link = ''
            }
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped></style>
