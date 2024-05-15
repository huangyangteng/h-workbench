<template>
    <section class="translate-wrapper">
        <el-input
            @mouseenter.native="onMouseEnter"
            @keydown.enter.native="submit"
            v-model="word"
        />
        <section class="translate-content">
            <div v-if="info" ref="info" class="info">
                <h4 @dblclick="copyQuestion">单词：{{ this.word }}</h4>

                <h4>使用频率：{{ level }}</h4>
                <h4>
                    释义：
                    <p v-for="item in this.info.meaning" :key="item">
                        {{ item }}
                    </p>
                    <p><b>释义使用频率统计:</b></p>
                    <p
                        class="indent20"
                        v-for="item in this.info.meaningTotal"
                        :key="item.sense"
                    >
                        {{ item.sense }}： {{ item.percent }}%
                    </p>
                </h4>
                <h4 v-if="this.info.usages.length">
                    用法:
                    <div
                        v-for="item in this.info.usages"
                        :key="item.content"
                        :class="item.type"
                    >
                        {{ item.content }}
                    </div>
                </h4>
                <h4>
                    例句:
                    <p v-for="item in this.info.examples" :key="item">
                        {{ item }}
                    </p>
                </h4>
            </div>
            <div class="image-list" v-if="false">
                <img
                    v-for="(item, index) in imageList"
                    :src="item"
                    :key="item + index"
                />
            </div>
        </section>

        <!-- ----用于supermemo -->
        <div
            class="translate-content"
            ref="question"
            style="position:absolute;left:0;margin-left: -100%;"
        >
            <h4>单词：{{ this.word }}</h4>
            <h4>使用频率：{{ level }}</h4>
            <h4>
                例句:
                <p v-for="item in this.info.examples" :key="item">
                    {{ formatSentence(item) }}.
                </p>
            </h4>
        </div>
    </section>
</template>

<script>
import { UTIL_API } from '../../api/util'
import { copyText, removeChinese } from '../../tools'

const LevelMap = {
    5: '海词5星基本词汇，属常用1000词。',
    4: '海词4星核心词汇，属常用3000词。',
    3: '3',
    2: '2',
    1: '1'
}
export default {
    name: 'translate',
    data() {
        return {
            word: 'bid',
            info: null,
            imageList: [
                'https://leexiao.site/file/2.jpg',
                'https://leexiao.site/file/2.jpg',
                'https://leexiao.site/file/2.jpg',
                'https://leexiao.site/file/2.jpg',
                'https://leexiao.site/file/2.jpg',
                'https://leexiao.site/file/2.jpg',
                'https://leexiao.site/file/2.jpg',
                'https://leexiao.site/file/2.jpg'
            ]
        }
    },
    computed: {
        level() {
            try {
                return LevelMap[this.info.level]
            } catch (e) {
                return ''
            }
        }
    },
    watch: {
        '$route.query.word': {
            immediate: true,
            handler(val) {
                if (val) {
                    console.log(val)
                    this.word = val
                    this.submit()
                }
            }
        }
    },
    methods: {
        copyQuestion() {
            let content = this.$refs.question.innerText
            copyText(content)
            this.$Message.success('已复制到剪贴板!')
        },
        formatSentence(str) {
            if (str.length < 10) return str
            return str.split('.')[0]
        },
        async submit() {
            const res = await UTIL_API.translate(this.word)
            this.info = res.data
            this.$nextTick(() => {
                this.copyToBoard()
            })
        },
        copyToBoard() {
            let content = this.$refs.info.innerText
            copyText(content)
        },
        onMouseEnter(e) {
            if (e.target.tagName === 'DIV') {
                e.target.children[0].select()
            }
        }
    },
    created() {
        this.submit()
    }
}
</script>
<style lang="scss">
.translate-wrapper {
    .el-input input,
    .el-textarea > textarea {
        background: $component-bg-color;
    }
}
</style>
<style lang="scss" scoped>
.translate-wrapper {
    width: 1440px;
    margin: 0 auto;
    padding: 40px;
    height: 100vh;
}

.translate-content {
    margin-top: 40px;
    min-height: 400px;

    display: flex;
    height: 100%;

    .info {
        padding: 20px;
        border-radius: 6px;
        overflow-y: auto;
    }

    h4 {
        line-height: 2;
    }

    p {
        text-indent: 10px;
        font-weight: 400;
    }

    .indent20 {
        text-indent: 20px;
    }

    .title {
        text-indent: 20px;
    }

    .usage {
        font-weight: 400;
        text-indent: 40px;
        margin-bottom: 10px;
    }
}

.info {
    background: $component-bg-color;
}

.image-list {
    margin-left: 20px;
    min-height: 400px;
    border-radius: 6px;
    background: $component-bg-color;
    width: 400px;
    height: 100%;
    overflow-y: auto;
    padding: 10px;

    img {
        width: 100%;
    }
}
</style>
