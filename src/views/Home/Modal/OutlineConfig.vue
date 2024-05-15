<template>
    <section>
        <el-popover placement="top-start" width="200" trigger="hover">
            <p style="font-size:12px">
                点击大纲后右侧内容跳转距离修正，设置为-96或60
            </p>
            <div>
                <el-input
                    size="small"
                    style="width:80px;margin-right:10px"
                    v-model="newDis"
                ></el-input>
                <el-button type="primary" size="mini" @click="setOutlineDis"
                    >确定</el-button
                >
            </div>
            <i class="el-icon-setting outline-config" slot="reference"></i>
        </el-popover>
    </section>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
            newDis: 0
        }
    },
    computed: {
        ...mapState('component', ['outlineScroll']),
        isShow: {
            get() {
                return this.outlineScroll.show
            },
            set(val) {
                this.updateOutlineScroll({ show: val })
            }
        }
    },
    watch: {
        'outlineScroll.dis': {
            immediate: true,
            handler(dis) {
                this.newDis = dis
            }
        }
    },
    methods: {
        ...mapMutations('component', ['updateOutlineScroll']),
        setOutlineDis() {
            this.updateOutlineScroll({ dis: this.newDis })
            this.$Message({
                type: 'success',
                message: '设置成功，点击大纲查看跳转距离是否正确'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.outline-config {
    cursor: pointer;
}
</style>
