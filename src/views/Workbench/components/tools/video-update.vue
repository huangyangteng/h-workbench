<template>
    <tools-item name="更新视频资源">
        <span>路径:</span>
        <el-input v-model="path"></el-input>
        <el-button @click="updateVideoResource">点击更新</el-button>
    </tools-item>
</template>

<script>
import ToolsItem from './tools-item'
import { WATCH_API } from '../../../../api/watch'

export default {
    name: 'video-update',
    components: { ToolsItem },
    data() {
        return {
            path: '/Users/h/Desktop/learnvideo'
        }
    },
    methods: {
        async updateVideoResource() {
            //把this.path存在store
            const res = await WATCH_API.run(this.path)
            if (res.code === 2000) {
                localStorage.setItem('video-path', this.path)
                this.$Message.success('更新成功')
            }
        }
    },
    mounted() {
        if (localStorage.getItem('video-path')) {
            this.path = localStorage.getItem('video-path')
        }
    }
}
</script>

<style scoped></style>
