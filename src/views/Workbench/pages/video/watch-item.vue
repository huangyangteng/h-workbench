<template>
    <div class="course-info" @click="jumpToCourse(info)">
        <section>
            <img v-if="info.poster" :src="info.poster" />
            <video
                v-else
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
                loop
                :src="getVideoSrc(info)"
            ></video>
            <div
                v-if="showManage"
                @click.stop="clickCheckbox(info.id)"
                class="checkbox click-big"
            >
                <el-checkbox :value="canShow"></el-checkbox>
            </div>
        </section>
        <footer>{{ info.title ? info.title : info.name }}</footer>
    </div>
</template>

<script>
import { getExt, isVideo } from '../../../../tools'
import { formatSrc } from '../../../../tools/watch-tools'

export default {
    name: 'watch-info',
    props: {
        info: {
            type: Object,
            required: true
        },
        showManage: {
            type: Boolean,
            default: false
        },
        canShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    computed: {},
    methods: {
        jumpToCourse(info) {
            if (info.bid) {
                this.$router.push({
                    name: 'watch',
                    params: {
                        id: info.bid
                    },
                    query: {
                        category: this.activeCategory,
                        link: info.link,
                        type: info.from === 'bb' ? 'bb' : 'acfun'
                    }
                })
            } else {
                this.$router.push({
                    name: 'watch',
                    params: {
                        id: info.id
                    },
                    query: {
                        category: this.activeCategory
                    }
                })
            }
        },
        onMouseEnter(e) {
            const dom = e.target
            dom.volume = 0
            dom.playbackRate = 2
            e.target.play()
        },
        onMouseLeave(e) {
            e.target.pause()
        },
        getVideoSrc(info) {
            const video = info.list.find(info => isVideo(getExt(info)))
            return formatSrc(video)
        },
        clickCheckbox(id) {
            this.$emit('clickCheckbox', id)
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.course-info {
    //height: 300px;
    cursor: pointer;
    position: relative;
    .setting {
    }
    .checkbox {
        position: absolute;
        padding: 5px;
        left: 0;
        top: 0;
    }

    > section {
        height: 200px;
        border-radius: 8px;
        overflow: hidden;

        video,
        img {
            width: 100%;
            height: 100%;
            // object-fit: cover;
        }
    }

    > footer {
        margin-top: 0.5em;
        font-size: 14px;
        font-weight: 800;
    }
}
</style>
