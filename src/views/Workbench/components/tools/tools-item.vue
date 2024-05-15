<template>
    <section class="tools-item" :style="{ width: width + 'px' }">
        <h4>{{ name }}</h4>
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: 'tools-item',
    props: {
        name: {
            type: String,
            required: true
        },
        width: {
            type: [Number, String],
            default: 400
        }
    },
    data() {
        return {}
    },
    computed: {},
    methods: {},
    created() {}
}
</script>

<style lang="scss" scoped>
.tools-item {
    padding: 10px 10px 20px;
    border-radius: 5px;
    margin: 20px;
    background: #1f2122;

    > h4 {
        margin-bottom: 10px;
    }
}
</style>
