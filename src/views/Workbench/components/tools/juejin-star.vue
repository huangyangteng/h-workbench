<template>
    <tools-item name="点赞" width="800">
        <i style="cursor: pointer" @click="getList" class="el-icon-refresh"></i>
        <div class="article-item" v-for="item in articles" :key="item.id">
            <b>{{ item.title }}</b>
            <span>{{ item.viewCount }}</span>
            <span>{{ item.starCount }}</span>
            <el-button @click="starArticle(item.id)" size="mini"
                >star
            </el-button>
        </div>
    </tools-item>
</template>

<script>
import ToolsItem from './tools-item'
import { JUEJIN_API } from '../../../../api/juejin'
import { formatArticle } from './juejin-tools'

export default {
    name: 'juejin-star',
    components: { ToolsItem },
    data() {
        return {
            articles: []
        }
    },
    computed: {},
    methods: {
        async getList() {
            const res = await JUEJIN_API.getList()
            if (res.code === 2000) {
                this.articles = formatArticle(res.data)
            }
        },
        async starArticle(id) {
            const res = await JUEJIN_API.star({ id })
            if (res.code === 2000) {
                this.$Message.success('点赞成功')
                this.getList()
            }
        }
    },
    created() {
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
.article-item {
    display: flex;
    margin-bottom: 8px;

    b {
        width: 400px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }

    span {
        margin: 0 10px;
        width: 40px;
    }
}
</style>
