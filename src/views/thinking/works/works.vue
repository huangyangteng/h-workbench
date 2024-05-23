<template>
    <section class="works">
        <h1>WORKS</h1>
        <el-table :data="list" style="width: 100%">
            <el-table-column type="index" width="50" />

            <el-table-column prop="title" label="标题">
                <template #default="scope">
                    <a :href="scope.row.link" target="_blank">{{
                        scope.row.title
                    }}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="relativeTime"
                label="date"
                width="300"
            ></el-table-column>
            <el-table-column
                prop="from"
                label="来源"
                width="100"
            ></el-table-column>
        </el-table>
    </section>
</template>

<script>
import { getWorkList } from '@/views/thinking/works/api'

export default {
    name: 'weekend-watch',
    data() {
        return {
            list: []
        }
    },
    computed: {},
    methods: {},
    async created() {
        this.list = await getWorkList()
    }
}
</script>

<style lang="scss" scoped>
.works {
    padding: 2em;
    max-width: 1900px;
    margin: 0 auto;
}
</style>
