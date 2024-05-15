<template>
    <section class="etf-item">
        <span>{{ item.name }}</span>
        <span>{{ item.code }}</span>
        <span>{{ item.price }}</span>
        <span>{{ item.buy1 }}</span>
        <span>{{ item.buy2 }}</span>
        <span>{{ item.sell1 }}</span>
        <span>{{ item.sell2 }}</span>
        <span>{{ item.status }}</span>
        <!--        链接-->
        <span v-if="isTitle">{{ item.link }}</span>
        <span v-else>
            <a style="margin-right: 5px" :href="tiantianLink" target="_blank"
                >天天</a
            >
            <a :href="souhuLink" target="_blank">搜狐</a>
        </span>
        <!--        操作-->
        <span v-if="isTitle">操作</span>
        <span v-else>
            <el-button @click="update" size="small" type="text">修改</el-button>
            <el-button size="small" type="text">删除</el-button>
        </span>
    </section>
</template>

<script>
export default {
    name: 'EtfItem',
    props: {
        item: Object
    },
    data() {
        return {}
    },
    computed: {
        isTitle() {
            return this.item.name === '名字'
        },
        tiantianLink() {
            return `http://fund.eastmoney.com/${this.item.code}.html`
        },
        souhuLink() {
            return `https://q.fund.sohu.com//${this.item.code}/index.shtml`
        }
    },
    methods: {
        del() {},
        update() {
            this.$emit('update', this.item)
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.etf-item {
    span {
        margin-left: 10px;
        margin-right: 10px;
        display: inline-block;
        min-width: 120px;
    }
}
</style>
