<template>
    <section class="translate-wrapper">
        <el-input
            @mouseenter.native="onMouseEnter"
            @keydown.enter.native="submit"
            v-model="word"
        />
        <el-button>数据结构</el-button>
        <el-button>数学</el-button>
    </section>
</template>

<script>
export default {
    name: 'translate',
    data() {
        return {
            word: 'bid',
            info: null
        }
    },
    watch: {
        '$route.query.word': {
            immediate: true,
            handler(val) {
                if (val) {
                    this.word = val
                    this.submit()
                }
            }
        }
    },
    methods: {
        submit() {
            window.open(
                'https://space.bilibili.com/279193889/search/video?keyword=' +
                    this.word
            )
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
    width: 1200px;
    margin: 0 auto;
    padding: 40px;
}
</style>
