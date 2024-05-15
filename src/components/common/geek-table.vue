<template>
    <section>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column
                v-for="item in tableColumn"
                :key="item"
                :prop="item"
                :label="item"
            />
        </el-table>
    </section>
</template>

<script>
export default {
    name: 'geek-table',
    props: {
        api: Function
    },
    data() {
        return {
            tableData: [],
            tableColumn: []
        }
    },
    computed: {},
    methods: {
        async getList() {
            const res = await this.api()
            if (res.code === 2000) {
                this.tableData = res.data
                if (res.data.length > 0) {
                    this.tableColumn = Object.keys(res.data[0])
                }
            }
        }
    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="" scoped></style>
