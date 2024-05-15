<template>
    <div
        class="drag-aside"
        :style="dragAsideStyle"
        @mousedown="handleMouseDown"
    ></div>
</template>
<script>
export default {
    data() {
        return {
            dragAside: {
                isMoving: false,
                left: 420,
                lastLeft: 0
            },
            left: 420
        }
    },
    computed: {
        dragAsideStyle() {
            return {
                left: this.left + 'px'
            }
        }
    },
    methods: {
        handleMouseDown(e) {
            e.stopPropagation()
            //初始left
            const startLeft = this.left

            const startX = e.clientX
            const move = moveEvent => {
                const currX = moveEvent.clientX
                let left = currX - startX + startLeft
                if (left < 300) {
                    left = 300
                }
                this.left = left
                this.$emit('on-drag', this.left)
            }

            const up = () => {
                const aside = document.querySelector('.read-aside')
                this.left = aside.offsetWidth
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)
            }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        },
        dragstart(e) {
            this.dragAside.lastLeft = e.clientX
            this.dragAside.isMoving = true
        },
        drag(e) {
            if (this.dragAside.isMoving) {
                let dis = e.clientX - this.dragAside.lastLeft
                let left = this.dragAside.lastLeft + dis - 10
                if (left < 300) {
                    left = 300
                } else if (left >= 600) {
                    left = 600
                }
                this.dragAside.left = left
                this.$emit('on-drag', this.dragAside.left)
            }
        }
    },
    mounted() {
        document.addEventListener('mousemove', e => {
            this.drag(e)
        })
        document.addEventListener('mouseup', () => {
            this.dragAside.isMoving = false
        })
    }
}
</script>
<style lang="scss" scoped>
.drag-aside {
    background: red;
    width: 10px;
    cursor: col-resize;
    position: absolute;
    height: calc(100% - 40px);
    z-index: 2;
    border: 10px solid transparent;
    margin-left: -10px;
    background-clip: padding-box;
}

//小于750的尺寸
@media (max-width: 750px) {
    .drag-aside {
        display: none;
    }
}
</style>
