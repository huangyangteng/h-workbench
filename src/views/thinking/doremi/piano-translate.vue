<template>
    <section>
        <div class="book-paragraph" v-for="(p, i) in list" :key="i">
            <div
                v-for="(item, index) in p.list"
                @dblclick="editItem($event, index)"
                :key="item.c + '' + index"
            >
                <span>{{ item.c }}</span>
                <span class="ch" v-if="item.ch">{{ item.ch }}</span>
            </div>
        </div>
        <div class="word-op" :style="wordOpStyle"></div>
    </section>
</template>

<script>
export default {
    name: 'piano-translate',
    props: {
        content: {
            type: Array
        },
        enContent: {
            type: String
        }
    },
    data() {
        return {
            list: [],
            wordOp: {
                left: 0,
                top: 0
            }
        }
    },
    computed: {
        wordOpStyle() {
            const { left, top } = this.wordOp
            return {
                left: left + 'px',
                top: top + 'px'
            }
        }
    },
    watch: {
        content: {
            immediate: true,
            handler(val) {
                if (Array.isArray(val) && val.length == 0) {
                    this.list = this.initContent(this.enContent)
                }
            }
        }
    },
    methods: {
        initContent(enContent) {
            return enContent
                .split('\n')
                .filter(item => !!item)
                .map(item => {
                    let list = item.split(' ').map(word => ({
                        c: word,
                        ch: '',
                        b: 0
                    }))
                    return {
                        style: {},
                        list: list
                    }
                })
        },
        editItem(e, index) {
            console.log(e, index)
            const { x, y } = e.target.getBoundingClientRect()
            this.wordOp = {
                left: x,
                top: y + 40
            }
        }
    },
    mounted() {
        //    点击空白关闭
    }
}
</script>

<style lang="scss" scoped>
.book-paragraph {
    display: flex;
    flex-wrap: wrap;
    width: 880px;
    font-size: 28px;
    margin: 40px auto;

    div {
        margin-right: 10px;
        margin-bottom: 16px;
        position: relative;

        .ch {
            position: absolute;
            font-size: 12px;
            white-space: nowrap;
            left: 2px;
            bottom: 0;
            margin-bottom: -20px;
            font-weight: 500;
        }
    }
}
.word-op {
    position: fixed;
    width: 200px;
    height: 200px;
    background: yellowgreen;
    border-radius: 4px;
    z-index: 1;
}
</style>
