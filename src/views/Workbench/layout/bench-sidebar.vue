<template>
    <section class="bench-sidebar">
        <header></header>
        <section>
            <div class="sidebar-item" v-for="m in menus" :key="m.name">
                <h5>{{ m.name }}</h5>
                <p
                    @click="toPage(item.route)"
                    v-for="item in m.children"
                    :key="item.name"
                    :class="{ active: isActive(item) }"
                >
                    {{ item.name }}
                </p>
            </div>
        </section>
    </section>
</template>

<script>
import { MENU_LIST } from './menu-list'
import { mapGetters } from 'vuex'

export default {
    name: 'bench-sidebar',
    data() {
        return {
            // menus: MENU_LIST
        }
    },
    computed: {
        ...mapGetters('user', ['menus'])
    },
    methods: {
        toPage(link) {
            if (this.$route.path == link) return
            this.$router.push({ path: link })
        },
        isActive(item) {
            return this.$route.path.includes(item.route)
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.bench-sidebar {
    > header {
        height: 40px;
    }
}

.sidebar-item {
    margin-bottom: 30px;

    > h5 {
        font-size: 12px;
        color: $color-help !important;
        margin-bottom: 12px;
    }

    > p {
        font-size: 14px;
        line-height: 2;
        padding-left: 30px;
        cursor: pointer;

        &.active {
            color: $--color-primary;
            font-weight: 500;
        }
    }
}
</style>
