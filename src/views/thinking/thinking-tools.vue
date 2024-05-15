<template>
    <section class="thinking-tools">
        <div class="th-tool-item">
            <i class="el-icon-s-home" @click="toHome"></i>
        </div>
    </section>
</template>

<script>
export default {
    name: 'thinking-tools',
    data() {
        return {}
    },
    computed: {},
    methods: {
        toHome() {
            this.$router.push({ path: '/' })
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
//小于750的尺寸
@media (max-width: 750px) {
    .thinking-tools {
        display: none;
    }
}

.thinking-tools {
    position: absolute;
    right: 0;
    bottom: 20px;
    margin-right: -40px;
}

.th-tool-item {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #1e2122;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background: rgba($--color-primary, 0.2);
        color: $--color-primary;
    }
}
</style>
