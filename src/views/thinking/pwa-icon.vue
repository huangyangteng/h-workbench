<template>
    <section class="pwa-icon-wrapper">
        <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
        >
            <img @load="draw" v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button
            @click="downloadAll"
            type="primary"
            style="position: absolute;top:100px;left:200px"
            >下载所有图片</el-button
        >

        <div class="image-wrapper">
            <canvas
                style="background: #ccc"
                v-for="item in imageList"
                :key="item.name"
                :width="item.width"
                :height="item.height"
                ref="canvas"
            ></canvas>
        </div>
    </section>
</template>

<script>
import { Upload } from 'element-ui'
import { downloadLink } from '../../tools'

export default {
    name: 'pwa-icon',
    data() {
        return {
            imageUrl: '',
            canvas: null,
            ctx: null,
            imageList: [
                { name: 'favicon-16x16.png', width: 16, height: 16 },
                { name: 'favicon-32x32.png', width: 32, height: 32 },
                { name: 'apple-touch-icon-60x60.png', width: 60, height: 60 },
                { name: 'apple-touch-icon-76x76.png', width: 76, height: 76 },
                {
                    name: 'apple-touch-icon-120x120.png',
                    width: 120,
                    height: 120
                },
                {
                    name: 'msapplication-icon-144x144.png',
                    width: 144,
                    height: 144
                },
                { name: 'mstile-150x150.png', width: 150, height: 150 },
                {
                    name: 'apple-touch-icon-152x152.png',
                    width: 152,
                    height: 152
                },
                {
                    name: 'apple-touch-icon-180x180.png',
                    width: 180,
                    height: 180
                },
                { name: 'apple-touch-icon.png', width: 180, height: 180 },
                { name: 'android-chrome-192x192.png', width: 192, height: 192 },
                {
                    name: 'android-chrome-maskable-192x192.png',
                    width: 192,
                    height: 192
                },
                {
                    name: 'android-chrome-maskable-512x512.png',
                    width: 512,
                    height: 512
                },
                { name: 'android-chrome-512x512.png', width: 512, height: 512 }
            ]
        }
    },
    components: {
        [Upload.name]: Upload
    },
    methods: {
        beforeAvatarUpload(file) {
            this.imageUrl = URL.createObjectURL(file)
            return false
        },
        initCanvas() {
            this.canvas = this.$refs.canvas
            this.ctx = this.canvas.getContext('2d')
        },
        draw(e) {
            let img = e.target
            for (let i = 0; i < this.imageList.length; i++) {
                let canvas = this.$refs.canvas[i]
                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            }

            // this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        },
        download(e) {
            this.canvas.toBlob(res => {
                const link = URL.createObjectURL(res)
                downloadLink(link, 'test.png')
            }, 'image/png')
        },
        downloadAll() {
            for (let i = 0; i < this.imageList.length; i++) {
                let canvas = this.$refs.canvas[i]
                canvas.toBlob(res => {
                    const link = URL.createObjectURL(res)
                    downloadLink(link, this.imageList[i].name)
                }, 'image/png')
            }
        }
    },
    mounted() {
        // this.initCanvas()
    }
}
</script>

<style lang="scss" scoped>
.pwa-icon-wrapper {
    width: 1000px;
    margin: 20px auto;
    position: relative;
}

.avatar-uploader .el-upload {
    border: 1px dashed #fff;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #fff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dotted #fff;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.image-wrapper {
    canvas {
        margin: 5px;
        display: inline-block;
    }
}
</style>
