<template>
    <section class="taobao-data-wrapper">
        <section class="box-card">
            <h1 style="margin-bottom:40px">淘宝评价导出</h1>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="活动时间">
                    <el-col :span="11">
                        <el-date-picker
                            placeholder="选择日期"
                            v-model="form.date"
                            style="width: 100%;"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                            ></el-date-picker
                        >
                    </el-col>
                </el-form-item>

                <el-form-item label="评价类型">
                    <el-radio-group v-model="form.rate">
                        <el-radio label="0">中评</el-radio>
                        <el-radio label="-1">差评</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="cookie">
                    <el-input
                        :autosize="{ minRows: 4, maxRows: 8 }"
                        type="textarea"
                        v-model="form.cookie"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        :loading="loading"
                        type="primary"
                        @click="onSubmit"
                        style="background:#ff9844;border-color:#ff9844"
                        >导出数据</el-button
                    >
                    <span style="margin-left:20px"
                        >（预计导出需要3-4分钟，请耐心等待）</span
                    >
                </el-form-item>
            </el-form>
        </section>
    </section>
</template>

<script>
import { UTIL_API } from '../../api/util'
import dayjs from 'dayjs'
export default {
    name: 'taobao-data',
    data() {
        return {
            form: {
                cookie: '',
                rate: '-1',
                date: ''
            },
            loading: false
        }
    },
    computed: {},
    methods: {
        async onSubmit() {
            if (!this.form.cookie) {
                this.$Message.error('请填写cookie')
                return
            }
            if (!this.form.date) {
                this.$Message.error('请选择日期')
                return
            }
            this.loading = true
            const { cookie, rate, date } = this.form
            const [startTime, endTime] = date

            const req = {
                startTime: dayjs(startTime).format('YYYYMMDD'),
                endTime: dayjs(endTime).format('YYYYMMDD'),
                rate,
                cookie
            }

            const res = await UTIL_API.taobaoExpert(req)
            if (res.code == 2000) {
                const link =
                    window.location.origin +
                    '/gk-api/util/download?file=' +
                    res.data.file
                window.location.href = link
                setTimeout(() => {
                    this.loading = false
                    this.$Message.success('导出完成，文件下载中!')
                }, 4000)
            } else {
                this.loading = false
            }
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.taobao-data-wrapper {
    padding-top: 60px;
}
.box-card {
    padding: 20px;
    width: 800px;
    margin: 0px auto;
    background: $component-bg-color;
}
</style>
