<template>
    <section class="panel-column-item">
        <h3 @click="toRead(column)">{{ column.title }}</h3>
        <p>
            <span class="column-tag mar-r-8">{{ column.authorName }}</span>
            <span class="column-tag">{{
                column.authorInfo.split('，')[0]
            }}</span>
        </p>
    </section>
</template>

<script>
export default {
    name: 'ColumeItem',
    props: {
        column: {
            type: Object
        }
    },
    data() {
        return {}
    },
    computed: {},
    methods: {
        toRead(column) {
            this.$router.push({
                name: 'read',
                params: { column: column.id }
            })
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.panel-column-item {
    background: $component-bg-color-2;
    padding: 1em;
    border-radius: $radius-sm;
    cursor: pointer;

    > h3 {
        font-size: 20px;
        font-weight: 400;
        transition: 0.5s;
        //white-space: nowrap;

        &:hover {
            color: $--color-primary !important;
        }
    }

    > p {
        margin-top: 1em;
    }
}
.column-tag {
    height: 20px;
    line-height: 20px;
    padding: 0 4px;
    font-size: 13px;
    font-weight: 400;
    color: #858585;
    background: $component-bg-color;
    border-radius: 2px;
}
</style>
