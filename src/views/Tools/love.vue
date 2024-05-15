<template>
    <section style="padding-top:150px">
        <div class="love-box">
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
            <h1>{{ showText }}</h1>
        </div>
    </section>
</template>

<script>
function dateAgo(date) {
    var startDate = new Date(date)
    var diffDate = new Date(new Date() - startDate)
    return {
        year: diffDate.toISOString().slice(0, 4) - 1970,
        month: diffDate.getMonth(),
        day: diffDate.getDate() - 1
    }
}

export default {
    name: 'love',
    data() {
        return {
            duration: {}
        }
    },
    computed: {
        showText() {
            const { year, month, day } = this.duration
            return `我们在一起有${year}年${month}个月${day}天啦`
        }
    },
    methods: {},
    mounted() {
        this.duration = dateAgo('2017-11-23')
        document.title = this.showText
    }
}
</script>

<style lang="scss" scoped>
.love-box {
    animation: wobble 5s ease-in-out infinite;
    transform-origin: center center;
    transform-style: preserve-3d;
    /*     perspective: 500px; */
}

@keyframes wobble {
    0%,
    100% {
        transform: rotate3d(1, 1, 0, 40deg);
    }
    25% {
        transform: rotate3d(-1, 1, 0, 40deg);
    }
    50% {
        transform: rotate3d(-1, -1, 0, 40deg);
    }
    75% {
        transform: rotate3d(1, -1, 0, 40deg);
    }
}

h1 {
    position: absolute;
    display: block;
    width: 100%;
    top: 120px;
    font-size: 100px;
    font-weight: bold;
    text-transform: uppercase;
    color: rgba(255, 100, 100, 1);
    text-shadow: 0 0 5px rgba(255, 0, 0, 1), 0 0 20px rgba(255, 0, 0, 0.8),
        0 0 50px rgba(255, 0, 0, 0.6);
    animation: glow 10s ease-in-out infinite;
    text-align: center;
}

@keyframes glow {
    from {
        filter: hue-rotate(0);
    }
    to {
        filter: hue-rotate(360deg);
    }
}

h1:nth-child(2) {
    transform: translateZ(5px);
}
h1:nth-child(3) {
    transform: translateZ(10px);
}
h1:nth-child(4) {
    transform: translateZ(15px);
}
h1:nth-child(5) {
    transform: translateZ(20px);
}
h1:nth-child(6) {
    transform: translateZ(25px);
}
h1:nth-child(7) {
    transform: translateZ(30px);
}
h1:nth-child(8) {
    transform: translateZ(35px);
}
h1:nth-child(9) {
    transform: translateZ(40px);
}
h1:nth-child(10) {
    transform: translateZ(45px);
}
</style>
