<template>
    <section class="outline-wrapper">
        <!-- <Input v-model="searchKey" @change="onSearch" /> -->
        <el-input
            prefix-icon="el-icon-search"
            size="mini"
            style="width:240px"
            v-model="filterText"
            clearable
        />
        <section class="outline-content">
            <el-menu
                @select="onSelect"
                :theme="theme"
                style="width:100%"
                class="watch-menu"
                :default-active="activeName"
            >
                <el-submenu
                    :index="unit.id"
                    v-for="unit in exhibitUnits"
                    :key="unit.id"
                >
                    <template slot="title">
                        <!-- <Icon type="ios-paper" /> -->
                        {{ cleanName(unit.unit) }}
                    </template>
                    <el-menu-item
                        v-for="item in unit.list"
                        :key="item.id"
                        :index="item.id + ''"
                        ><span>{{ cleanName(item.name) }}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </section>
    </section>
</template>

<script>
import { getVideoItem } from '../../../../tools/watch-tools'
import pinyin from 'pinyin'
import { deepCopy } from '../../../../tools'

export default {
    name: 'outline-list',
    props: {
        units: {
            /**
             * unitItem
             * id:'',list:videoList[],unit:'unit的名字'
             *
             * videoList[]
             * {id:'video id',name:'video name'}
             */
            type: Array,
            default: () => []
        },
        active: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            activeName: '',
            theme: 'dark',
            filterText: ''
        }
    },
    watch: {
        active(id) {
            this.activeName = String(id)
        }
    },
    computed: {
        exhibitUnits() {
            if (!this.filterText) {
                return this.units
            } else {
                const getReg = queryString => {
                    let str = '(.*?)'
                    let queryStringArr = queryString.split('')
                    let regStr = str + queryStringArr.join(str) + str
                    return RegExp(regStr, 'i')
                }
                const reg = getReg(this.filterText)
                let bakList = deepCopy(this.units)
                return bakList.map(unit => {
                    unit.list = unit.list.filter(item => {
                        let title = this.cleanName(item.name).toLowerCase()
                        // let title_pinyin = pinyin(title, {
                        //     segment: true,
                        //     group: true,
                        //     style: pinyin.STYLE_NORMAL
                        // })
                        //     .flat()
                        //     .join('')
                        return title.includes(this.filterText)
                    })
                    return unit
                })
            }
        }
    },
    methods: {
        onSearch() {
            // units结果+  item结果拼成一个unit, 关键字高亮
        },
        onSelect(id) {
            this.$emit('on-change', getVideoItem(id, this.units))
        },
        cleanName(name) {
            return name
                .replace('【微信535950311】', '')
                .replace('(更多IT教程 微信352852792)', '')
                .replace(/【更多.*】/, '')
                .replace(/【众筹.*】/, '')
                .replace(/【itjc8.*】/, '')
                .replace(/【加qq.*】/, '')
                .replace(/\[qq.*\]/, '')
                .replace(/\[加q.*\]/, '')
                .replace('开课吧前端架构-16期', '')
                .replace('_更多IT资源微信535950311', '')
                .replace(
                    /\d{3}\s-\s\d{3}—2022考研数学(-)?高等数学(-)?第.{1,2}章/,
                    ''
                )
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.outline-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.outline-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>