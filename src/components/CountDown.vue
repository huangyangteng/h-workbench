<template>
    <section class="count-down">
        倒计时：<b>{{ diffDay }}</b> 天
    </section>
</template>

<script>
import dayjs from 'dayjs'

export default {
    name: 'CountDown',
    data() {
        return {
            diffDay: 0,
            to: '',
            from: ''
        }
    },
    computed: {},
    methods: {
        diffDate() {
            this.diffDay = dayjs(this.to).diff(dayjs(this.from), 'day')
        }
    },
    created() {
        this.from = dayjs()
        this.to = dayjs('2022-12-25')
        this.diffDate()
    }
}
</script>

<style lang="scss" scoped>
.count-down {
    position: fixed;
    left: 60px;
    top: 60px;
}
</style>
