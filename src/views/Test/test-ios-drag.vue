<template>
    <section class="wrapper">
        <div
            class="box"
            draggable="true"
            v-for="(item, index) in list"
            :key="item.id"
            @dragstart="handleDragStart($event, index)"
            @dragend="handleDragEnd($event, index)"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragenter="handleDragEnter($event, index)"
            @dragleave="handleDragLeave($event, index)"
        ></div>
    </section>
</template>

<script>
//区分下文件和文件夹
export default {
    name: 'test-ios-drag',
    data() {
        return {
            list: [
                { id: 0, name: '测试00', type: 'file' },
                { id: 2, name: '测试02', type: 'file' },
                { id: 1, name: '测试01', type: 'file' }
            ],
            curDragIndex: -1
        }
    },
    computed: {},
    methods: {
        handleDragStart(e, index) {
            console.log(e, index)
            // e.target.style.visibility = 'hidden'
            // e.target.style.opacity = '0'

            this.curDragIndex = index
        },
        handleDragEnd(e) {
            this.curDragIndex = -1
            // e.target.style.visibility = 'visible'
            // e.target.style.opacity = '1'
        },
        handleDragEnter(e, index) {
            e.preventDefault()
            if (index != this.curDragIndex) {
                e.target.classList.add('enter')
            }
        },
        handleDragLeave(e, index) {
            console.log('drag leave')
            if (index != this.curDragIndex) {
                e.target.classList.remove('enter')
            }
        },
        handleDrop(e) {
            console.log('drag drop')
            e.preventDefault()
            e.stopPropagation()
        },
        handleDragOver(e) {
            // console.log('drag over')
            //设置拖放目标，默认情况下浏览器阻止所有的拖放操作，所以需要监听dragenter或者dragover取消浏览器默认行为使元素可拖放.
            e.preventDefault()
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.wrapper {
    width: 1000px;
    margin: 40px auto;
}

.box {
    background: #3a8ee6;
    margin: 10px;
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    transition: 0.3s;
}

.box.enter {
    border: 2px solid rebeccapurple;
    transform: scale(1.1);
}

//.box:nth-child(1){
//  background: #44a0ff;
//}
</style>
