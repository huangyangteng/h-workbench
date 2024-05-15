<template>
    <section>
        <card-dragger
            :data="cardList"
            :colNum="4"
            :cardOutsideWidth="300"
            :cardInsideWidth="260"
            :cardOutsideHeight="310"
            :cardInsideHeight="240"
        ></card-dragger>
    </section>
</template>

<script>
import CardDragger from './cardDragger'

export default {
    name: 'TestCardDragger',
    components: { CardDragger },
    data() {
        return {
            cardList: [
                {
                    positionNum: 1,
                    name: '测试卡片1',
                    id: 'card1'
                },
                {
                    positionNum: 2,
                    name: '测试卡片2',
                    id: 'card2'
                },
                {
                    positionNum: 3,
                    name: '测试卡片3',
                    id: 'card3'
                },
                {
                    positionNum: 4,
                    name: '测试卡片4',
                    id: 'card4'
                }
            ]
        }
    },
    computed: {},
    methods: {},
    created() {}
}
</script>

<style lang="" scoped></style>
