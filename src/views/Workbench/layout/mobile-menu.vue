<template>
    <section>
        <section></section>
        <aside>展开</aside>
    </section>
</template>

<script>
export default {
    name: 'mobile-menu',
    props: {
        units: {
            type: Array,
            default: () => []
        },
        active: {
            type: [String, Number],
            default: ''
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

<style lang="" scoped></style>
