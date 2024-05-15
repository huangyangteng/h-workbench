<template>
    <section class="etf-wrapper">
        <section>
            <EtfItem
                @update="initUpdate"
                v-for="item in list"
                :key="item.id"
                :item="item"
            ></EtfItem>
        </section>
        <aside>
            <div style="text-align: right">
                <el-button type="text" @click="clear">清空</el-button>
                <el-button v-if="!isUpdate" type="text" @click="add"
                    >添加
                </el-button>
                <el-button v-else type="text" @click="update">修改</el-button>
            </div>
            <div class="etf-add-item">
                <span
                    >代码
                    <a
                        v-if="isValidate"
                        style="margin-right: 5px"
                        :href="tiantianLink"
                        target="_blank"
                        >天天</a
                    >
                    <a v-if="isValidate" :href="souhuLink" target="_blank"
                        >搜狐</a
                    >
                </span>
                <el-input v-model="info.code"></el-input>
            </div>
            <div class="etf-add-item">
                <span>名字</span>
                <el-input v-model="info.name"></el-input>
            </div>
            <div class="etf-add-item">
                <span>净值</span>
                <el-input v-model="info.price"></el-input>
            </div>
            <div class="etf-add-item">
                <span>buy1</span>
                <el-input v-model="info.buy1"></el-input>
            </div>
            <div class="etf-add-item">
                <span>buy2</span>
                <el-input v-model="info.buy2"></el-input>
            </div>
            <div class="etf-add-item">
                <span>sell1</span>
                <el-input v-model="info.sell1"></el-input>
            </div>
            <div class="etf-add-item">
                <span>sell2</span>
                <el-input v-model="info.sell2"></el-input>
            </div>
        </aside>
    </section>
</template>

<script>
import EtfItem from './components/EtfItem'
import { ETF_API } from '../../api/etf'

export default {
    name: 'eft',
    components: { EtfItem },
    data() {
        return {
            list: [],
            info: {
                id: '',
                code: '515030',
                buy1: 1,
                buy2: 1,
                sell1: 1.5,
                sell2: 1.5,
                name: ''
            },
            isUpdate: false
        }
    },
    computed: {
        tiantianLink() {
            return `http://fund.eastmoney.com/${this.info.code}.html`
        },
        souhuLink() {
            return `https://q.fund.sohu.com//${this.info.code}/index.shtml`
        },
        isValidate() {
            return this.info.code.length === 6
        }
    },
    watch: {
        'info.code'(code) {
            console.log('😅😅😅', code)
            if (code.length === 6) {
                this.getOne(code)
            }
        }
    },
    methods: {
        clear() {
            this.isUpdate = false
            this.info = {
                id: '',
                code: '',
                buy1: 1,
                buy2: 1,
                sell1: 1.5,
                sell2: 1.5,
                name: ''
            }
        },
        async getList() {
            const res = await ETF_API.getList()
            this.list = [
                {
                    id: 0,
                    name: '名字',
                    code: '代码',
                    price: '价格',
                    buy1: '买1',
                    buy2: '买2',
                    sell1: '卖1',
                    sell2: '卖2',
                    link: '链接',
                    status: '状态'
                },
                ...res.data
            ]
        },
        async getOne(code) {
            const res = await ETF_API.getOne(code)
            this.info.name = res.data[1]
            this.info.price = res.data[2]
        },
        async add() {
            const res = await ETF_API.add(this.info)
            if (res.code === 2000) {
                this.$Message.success('添加成功')
                this.getList()
            }
        },
        async update() {
            const res = await ETF_API.update(this.info)
            if (res.code === 2000) {
                this.$Message.success('修改成功')
                this.getList()
            }
        },
        initUpdate(item) {
            this.isUpdate = true
            this.info = item
        }
    },
    created() {
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
.etf-wrapper {
    padding: 20px;
    display: flex;

    > section {
        flex: 1;
        margin-right: 20px;
    }

    > aside {
        border-radius: 20px;
        background: $component-bg-color;
        padding: 10px 20px;
        width: 300px;

        .etf-add-item {
            margin-bottom: 10px;
        }
    }
}
</style>
