<template>
    <section class="read-outline">
        <section class="outline-wrapper">
            <div
                :id="item.top"
                :key="item.id"
                v-for="item in outlineList"
                :class="outlineClassObj(item)"
                @click="jumpToTitle(item)"
            >
                {{ item.name }}
            </div>
        </section>
    </section>
</template>
<script>
import { mapState } from 'vuex'

export default {
    name: 'read-outline',
    data() {
        return {}
    },
    computed: {
        ...mapState('column', ['status', 'outlineList']),
        ...mapState('component', ['outlineScroll'])
    },
    methods: {
        outlineClassObj(item) {
            if (item.tag == 'H2') {
                return { 'outline-h2': true }
            } else if (item.tag == 'H3') {
                return { 'outline-h3': true }
            } else if (item.tag == 'H1') {
                return { 'outline-h1': true }
            }
        },
        jumpToTitle(item) {
            let wrapper = document.querySelector('.article-wrapper')
            let cur = document.getElementById(item.id)
            wrapper.scrollTop = cur.offsetTop + Number(this.outlineScroll.dis)
        }
    }
}
</script>
<style lang="scss" scoped>
.show-outline {
    position: absolute;
    right: 20px;
    cursor: pointer;
    font-size: 12px;
    top: 20px;
    z-index: 1;
}

.outline-wrapper {
    padding: 20px;
    font-size: 12px;
    position: relative;
}

.outline-wrapper > header {
    text-align: center;
    margin-bottom: 10px;
}

.outline-wrapper > div {
    cursor: pointer;
    transition: 0.5s;
}

.outline-wrapper > div:hover {
    color: #fa8919;
    text-decoration: underline;
}

.outline-wrapper > .outline-h1 {
}

.outline-wrapper > .outline-h2 {
    padding-left: 20px;
}

.outline-wrapper > .outline-h3 {
    padding-left: 40px;
}
</style>
