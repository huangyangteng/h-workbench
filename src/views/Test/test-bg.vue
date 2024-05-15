<template>
    <section class="bg">
        <div class="box"></div>
        <h1 style="text-align: center;font-size: 200px;color:#fff">
            人生如逆旅
        </h1>
    </section>
</template>

<script>
export default {
    name: 'test-bg',
    data() {
        return {}
    },
    computed: {},
    methods: {},
    created() {}
}
</script>

<style lang="scss" scoped>
.bg {
    width: 100vw;
    height: 100vh;
    background-image: url('https://ssyerv1.oss-cn-hangzhou.aliyuncs.com/picture/45780425aba04685a790965ec38fe7d0.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
}
//
.box {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    left: 0;
}
</style>
