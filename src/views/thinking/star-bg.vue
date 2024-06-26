<template>
    <div class="container">
        <div class="sky">
            <slot></slot>
            <template v-if="isMoving">
                <div class="stars"></div>
                <div class="stars1"></div>
                <div class="stars2"></div>
                <div class="shooting-stars"></div>
            </template>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../tools'

export default {
    name: 'star-bg',
    data() {
        return {
            isMoving: true
        }
    },
    computed: {},
    methods: {},
    mounted() {
        eventBus.$on('star-moving', moving => {
            this.isMoving = moving
        })
    },
    beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
$starFieldWidth: 2560;
$starFieldHeight: 2560;
$starStartOffset: 600px;

$starOneScrollDuration: 100s;
$starTwoScrollDuration: 125s;
$starThreeScrollDuration: 175s;
$numStarOneStars: 1700;
$numStarTwoStars: 700;
$numStarThreeStars: 200;
$numShootingStars: 200;
$width: 100%;

.container {
    display: block;
    position: relative;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, #020107 0%, #201b46 100%);

    .text {
        color: #fff;
        position: absolute;
        top: 50%;
        right: 50%;
        margin: -10px -75px 0 0;
        font-size: 20px;
        font-family: sans-serif;
        font-weight: bold;
    }
}

@function create-stars($n) {
    $stars: '#{random($starFieldWidth)}px #{random($starFieldHeight)}px #FFF';

    @for $i from 2 through $n {
        $stars: '#{$stars} , #{random($starFieldWidth)}px #{random($starFieldHeight)}px #FFF';
    }

    @return unquote($stars);
}

@mixin star-template($numStars, $starSize, $scrollSpeed) {
    z-index: 10;
    width: $starSize;
    height: $starSize;
    border-radius: 50%;
    background: transparent;
    box-shadow: create-stars($numStars);
    animation: animStar $scrollSpeed linear infinite;
    &:after {
        content: ' ';
        top: -$starStartOffset;
        width: $starSize;
        height: $starSize;
        border-radius: 50%;
        position: absolute;
        backgroud: transparent;
        box-shadow: create-stars($numStars);
    }
}

@mixin shooting-star-template($numStars, $starSize, $speed) {
    z-index: 10;
    width: $starSize;
    height: $starSize + 80px;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
    background: linear-gradient(
        to top,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1)
    );
    animation: animShootingStar $speed linear infinite;
}

.stars {
    @include star-template($numStarOneStars, 1px, $starOneScrollDuration);
}

.stars1 {
    @include star-template($numStarTwoStars, 2px, $starTwoScrollDuration);
}

.stars2 {
    @include star-template($numStarThreeStars, 3px, $starThreeScrollDuration);
}

.shooting-stars {
    @include shooting-star-template($numShootingStars, 5px, 30s);
}

@keyframes animStar {
    from {
        transform: translateY(0px);
    }
    to {
        transform: translateY(-#{$starFieldHeight}px)
            translateX(-#{$starFieldWidth}px);
    }
}

@keyframes animShootingStar {
    from {
        transform: translateY(0px) translateX(0px) rotate(-45deg);
        opacity: 1;
        height: 5px;
    }
    to {
        transform: translateY(-#{$starFieldHeight}px)
            translateX(-#{$starFieldWidth}px) rotate(-45deg);
        opacity: 1;
        height: 800px;
    }
}
</style>
