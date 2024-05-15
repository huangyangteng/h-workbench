<template>
    <section class="menu-overlay" :class="{ open: this.show }">
        <ul class="nav-categories" v-if="this.show">
            <li
                v-for="(item, index) in menuList"
                @click="toPage(item.route)"
                :key="item.name"
                class="animate__animated animate__fadeInDown"
                :style="getAnimationStyle(index)"
            >
                {{ item.name }}
            </li>
        </ul>
    </section>
</template>

<script>
import { eventBus } from '../../../tools'
import { MENU_LIST } from './menu-list'
import { mapGetters } from 'vuex'

export default {
    name: 'menu-overlay',
    data() {
        // const menus = MENU_LIST.map(item => item.children).reduce(
        //     (prev, cur) => prev.concat(cur),
        //     []
        // )
        return {
            show: false
            // menuList: menus
        }
    },
    computed: {
        ...mapGetters('user', ['menus']),
        menuList() {
            return this.menus
                .map(item => item.children)
                .reduce((prev, cur) => prev.concat(cur), [])
        }
    },
    methods: {
        toPage(link) {
            if (this.$route.path == link) return
            this.$router.push({ path: link })
            eventBus.$emit('menu-close')
        },
        getAnimationStyle(index) {
            console.log(index)
            return {
                'animation-delay': 0.1 * index + 's'
            }
        }
    },
    mounted() {
        eventBus.$on('toggle-open', val => {
            this.show = val
        })
    }
}
</script>

<style lang="scss" scoped>
.menu-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    color: #333;
    height: 100%;
    width: 100%;
    position: fixed;
    opacity: 0;
    visibility: hidden;
    text-align: center;
    transition: opacity 0.2s ease-in-out;
    z-index: 1001;
    left: 0;
    top: 0;
}

.menu-overlay.open {
    opacity: 1;
    visibility: visible;
    transition-delay: 0.03s;
}

.nav-categories {
    margin-top: 15vh;
    width: 620px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;

    li {
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        font-weight: 500;
        padding: 10px 0;
    }
}
</style>
