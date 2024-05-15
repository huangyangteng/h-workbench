<template>
    <Poptip placement="bottom" class="tip-pop" trigger="hover">
        <slot></slot>
        <div slot="content" class="content">
            <table class="tip-body">
                <thead>
                    <tr>
                        <th>操作</th>
                        <th>快捷键</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list" :key="item.operation">
                        <td>{{ item.operation }}</td>
                        <td>{{ item.shortcut }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Poptip>
</template>

<script>
export default {
    name: 'keyboard-tip',
    data() {
        return {
            list: [
                { operation: '播放/暂停', shortcut: '空格 ' },
                { operation: '进度调节', shortcut: '左右键👉👈' },
                { operation: '音量调节', shortcut: '上下键👆👇' },
                { operation: '全屏', shortcut: '双击视频' }
            ]
        }
    },
    computed: {},
    methods: {},
    created() {}
}
</script>

<style lang="scss" scoped>
.tip-pop {
    ///deep/ .ivu-poptip-inner {
    //    background: $component-bg-color;
    //}
    //
    ///deep/ .ivu-poptip-popper[x-placement^='bottom'] .ivu-poptip-arrow:after {
    //    border-bottom-color: $component-bg-color;
    //}
}

.content {
    background: $component-bg-color;
    color: $font-color;
}

.tip-body {
    tr {
        text-align: center;
    }

    th,
    td {
        padding: 5px 10px;
    }
}
</style>
