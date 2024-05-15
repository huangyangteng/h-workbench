<template>
    <section class="upload-wrapper">
        <section class="upload-query">
            <el-button @click="$router.push({ path: '/' })">home</el-button>
            <el-button @click="getToDay">最近24小时</el-button>
            <el-button @click="get3Day">最近3天</el-button>
            <el-button @click="get7Day">最近1周</el-button>
            <el-button type="primary" @click="getRecentFiles">刷新</el-button>
        </section>
        <img
            @dblclick="delImage(item.id)"
            @click="clikeImg(item.path, $event)"
            v-for="item in imageList"
            :key="item.id"
            :src="FILE_PREFIX + item.path"
            alt=""
            srcset=""
        />
        <PicturePreview v-if="true"></PicturePreview>
    </section>
</template>

<script>
import { UTIL_API } from '../../api/util'
import PicturePreview from '../Home/Modal/PicturePreview'
import { resizeImg } from './resize-img'

import { mapState, mapMutations } from 'vuex'
import dayjs from 'dayjs'

export default {
    name: 'upload-img',
    components: {
        PicturePreview
    },
    data() {
        return {
            imageList: [
                {
                    id: 'yNyfsZ2YqimVRI59',
                    name: 'blob',
                    path: 'gk-files/upload_03c0691e543907f6bc92df63eba2da12',
                    date: '2021-12-27 21:50:10'
                }
            ],
            FILE_PREFIX: '/',
            timer: 0
        }
    },
    computed: {
        ...mapState('component', ['picturePreview'])
    },
    methods: {
        ...mapMutations('component', ['updatePicturePreview']),
        getToDay() {
            const end = dayjs().format('YYYY-MM-DD HH:mm:ss')
            const start = dayjs()
                .subtract(1, 'day')
                .format('YYYY-MM-DD HH:mm:ss')
            this.getFiles({ start, end })
        },
        get3Day() {
            const end = dayjs().format('YYYY-MM-DD HH:mm:ss')
            const start = dayjs()
                .subtract(3, 'day')
                .format('YYYY-MM-DD HH:mm:ss')
            this.getFiles({ start, end })
        },
        get7Day() {
            const end = dayjs().format('YYYY-MM-DD HH:mm:ss')
            const start = dayjs()
                .subtract(7, 'day')
                .format('YYYY-MM-DD HH:mm:ss')
            this.getFiles({ start, end })
        },
        delImage(id) {
            console.log()
            const index = this.imageList.findIndex(item => item.id === id)
            if (index != -1) {
                this.imageList.splice(index, 1)
            }
        },
        clikeImg(src, e) {
            console.log('e.target.offsetWidth', e.target.offsetWidth)
            e.target.style.width = e.target.offsetWidth * 1.2 + 'px'
            e.stopPropagation()
            // this.updatePicturePreview({
            //     show: true,
            //     src: this.FILE_PREFIX + src,
            //     width: e.target.naturalWidth + 'px'
            // })
        },
        async handlePaster() {
            var items = event.clipboardData && event.clipboardData.items
            var file = null
            if (items && items.length) {
                // 检索剪切板items
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        file = items[i].getAsFile()
                        break
                    }
                }
            }
            if (!file) {
                console.log('no file')
                return
            }

            const compressedFile = await resizeImg(file)

            let formData = new FormData()
            formData.append('file', compressedFile)

            const res = await UTIL_API.upload(formData)
            if (res.code === 2000) {
                this.$Message.success('上传成功')
                this.getFiles()
            }
        },
        async getFiles({ start, end }) {
            const res = await UTIL_API.getFiles({
                start,
                end,
                random: Math.random()
            })

            if (res.code === 2000) {
                this.imageList = res.data
            }
            console.log('getFiles -> res', res.data)
        },
        getRecentFiles() {
            // 只获取最近三个小时之内的数据
            const end = dayjs().format('YYYY-MM-DD HH:mm:ss')
            const start = dayjs()
                .subtract(3, 'hour')
                .format('YYYY-MM-DD HH:mm:ss')
            this.getFiles({ start, end })
        }
    },
    mounted() {
        this.getRecentFiles()
        document.addEventListener('paste', this.handlePaster)
    },
    beforeDestroy() {
        document.removeEventListener('paste', this.handlePaster)
    }
}
</script>

<style lang="scss" scoped>
.upload-wrapper {
    margin: 0 auto;

    img {
        width: 600px;
        margin: 10px;
    }
}

.upload-query {
    padding: 20px 40px;

    button {
        margin-right: 10px;
    }
}
</style>
