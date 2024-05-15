<template>
    <section>
        <span>租期开始日期：</span>
        <el-date-picker v-model="from" type="date" placeholder="开始日期">
        </el-date-picker>
        <div v-for="item in list" :key="item">{{ item }}</div>
    </section>
</template>

<script>
import dayjs from 'dayjs'

export default {
    name: 'calc-rent',
    data() {
        return {
            from: '2021-9-18 00:00:00',
            size: 10
        }
    },
    computed: {},
    watch: {
        from() {
            this.size = 10
            this.calcDate()
        }
    },
    methods: {
        calcDate() {
            let list = []
            let date = this.from

            while (this.size--) {
                let item = dayjs(date)
                    .add(3, 'month')
                    .format('YYYY-MM-DD')
                list.push(item)
                date = item
            }
            this.list = list
        }
    },
    created() {
        this.calcDate()
    }
}
</script>

<style lang="" scoped></style>
