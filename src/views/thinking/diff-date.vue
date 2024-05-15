<template>
    <section style="width: 800px;margin:20px auto">
        <h1>计算两个日期之间的天数</h1>
        <div style="margin-top: 60px">
            <el-date-picker v-model="from" type="date" placeholder="开始日期">
            </el-date-picker>

            <el-date-picker
                v-model="to"
                type="date"
                @change="diffDate"
                placeholder="结束日期"
            >
            </el-date-picker>
        </div>
        <div style="letter-spacing: 5px;padding-left: 20px">
            <b style="font-size: 36px">{{ diffDay }}</b
            >天
            <br />
            <b style="font-size: 36px">{{ diffWeek }}</b
            >周
            <br />
            <b style="font-size: 36px">{{ diffMonth }}</b
            >月
        </div>
    </section>
</template>

<script>
import dayjs from 'dayjs'

export default {
    name: 'diff-date',
    data() {
        return {
            from: '',
            to: '',
            diffDay: 0,
            diffWeek: 0,
            diffMonth: 0
        }
    },
    computed: {},
    methods: {
        diffDate() {
            if (this.to && this.from) {
                this.diffDay = dayjs(this.to).diff(dayjs(this.from), 'day')
                this.diffMonth = dayjs(this.to).diff(dayjs(this.from), 'month')
                this.diffWeek = dayjs(this.to).diff(dayjs(this.from), 'week')
            }
        }
    },
    created() {
        this.from = dayjs()
        this.to = dayjs('2022-12-25')
        this.diffDate()
    }
}
</script>

<style lang="" scoped></style>
