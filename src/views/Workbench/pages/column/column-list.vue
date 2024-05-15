<template>
    <section>
        <column></column>
    </section>
</template>

<script>
import ColumnList from '../../../ColumnList/ColumnList'
export default {
    name: 'column-list',
    components: {
        column: ColumnList
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
.column-list-wrapper {
    width: 1200px;
    margin: 40px auto;
}
</style>
