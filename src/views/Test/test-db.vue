<template>
    <section>
        <button @click="add">add</button>
        <button @click="getData">get data</button>
    </section>
</template>

<script>
import {
    getArticleCache,
    initArticleCache,
    addArticleCache
} from '@/tools/cache'

export default {
    name: 'test-db',
    data() {
        return {}
    },
    computed: {},
    methods: {
        add() {
            addArticleCache(100, 'ajdjfdjfjj')
        },
        async getData() {
            let data = await getArticleCache(100)
            console.log(data)
        }
    },
    created() {},
    mounted() {
        initArticleCache('article')
    }
}
</script>
<style lang="scss" scoped></style>