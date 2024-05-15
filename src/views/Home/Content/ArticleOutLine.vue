<template>
    <section>
        <section class="article-outline" v-show="showOutline">
            <i
                @click="showOutline = false"
                style="position: absolute;margin-left: 18px"
                class="el-icon-close"
            ></i>
            <read-outline></read-outline>
        </section>
    </section>
</template>

<script>
import ReadOutline from '../Aside/ReadOutline'

export default {
    name: 'article-outline',
    components: { ReadOutline },
    data() {
        return {
            showOutline: true
        }
    },
    computed: {},
    methods: {},
    created() {}
}
</script>

<style lang="scss" scoped>
.article-outline {
    position: fixed;
    max-width: 300px;
    right: 0;
    bottom: 20%;
    z-index: 1;
    opacity: 0.8;

    i {
        display: none;
        z-index: 1;
    }

    &:hover {
        i {
            display: block;
        }
    }
}

//小于750的尺寸
@media (max-width: 1380px) {
    .article-outline {
        display: none;
    }
}
</style>
