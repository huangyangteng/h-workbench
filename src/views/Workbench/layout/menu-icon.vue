<template>
    <div class="menu" :class="{ open: this.open }" @click="toggleOpen">
        <span class="menu-circle"></span>
        <a class="menu-link">
            <span class="menu-icon">
                <span class="menu-line menu-line-1"></span>
                <span class="menu-line menu-line-2"></span>
                <span class="menu-line menu-line-3"></span>
            </span>
        </a>
    </div>
</template>

<script>
import { eventBus } from '../../../tools'

export default {
    name: 'menu-icon',
    data() {
        return {
            open: false
        }
    },
    computed: {},
    methods: {
        toggleOpen() {
            this.open = !this.open
            eventBus.$emit('toggle-open', this.open)
        }
    },
    mounted() {
        eventBus.$on('menu-close', this.toggleOpen)
    }
}
</script>

<style lang="scss" scoped>
.menu {
    position: absolute;
    top: 5px;
    left: 5px;
    height: 42px;
    width: 42px;
    display: none;
}
@media (max-width: 750px) {
    .menu {
        display: block;
    }
}

.menu-circle {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 50%;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    z-index: 1000;
}

//.menu:hover .menu-circle {
//    transform: scale(1.5);
//}

.menu.open .menu-circle {
    transform: scale(60);
    opacity: 0;
}

.menu-link {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1002;
}

.menu-icon {
    position: absolute;
    width: 20px;
    height: 14px;
    margin: auto;
    left: 0;
    top: 0;
    right: 0;
    bottom: 1px;
}

.menu-line {
    background-color: #fafafa;
    height: 2px;
    width: 100%;
    border-radius: 2px;
    position: absolute;
    left: 0;
    transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.menu-line-1 {
    top: 0;
}

.menu-line-2 {
    top: 0;
    bottom: 0;
    margin: auto;
}

.menu-line-3 {
    bottom: 0;
}

.menu.open .menu-line-1 {
    transform: translateY(7px) translateY(-50%) rotate(-135deg);
}

.menu.open .menu-line-2 {
    opacity: 0;
}

.menu.open .menu-line-3 {
    transform: translateY(-7px) translateY(50%) rotate(135deg);
}

</style>
