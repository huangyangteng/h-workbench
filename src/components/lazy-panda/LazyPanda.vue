<template>
    <section
        class="model-wrapper"
        id="model-box"
        @click="clickBingDun"
    ></section>
</template>

<script>
import { init } from './renderModel'

export default {
    name: 'lazy-panda',
    data() {
        return {
            show: true
        }
    },
    computed: {},
    methods: {
        clickBingDun() {
            this.show = false
        }
    },
    mounted() {
        init()
    }
}
</script>

<style lang="scss" scoped>
.model-wrapper {
    width: 600px;
    height: 400px;
}

//小于1200的屏幕
@media (max-width: 1200px) {
    .model-wrapper {
        display: none;
    }
}
</style>
