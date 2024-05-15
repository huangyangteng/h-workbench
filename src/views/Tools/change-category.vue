<template>
    <section>
        <el-button @click="filterList">过滤没有type的</el-button>
        <el-select v-model="selectType">
            <el-option
                v-for="path in pathList"
                :key="path.name"
                :value="path.name"
                :label="path.label"
            ></el-option>
        </el-select>
        <div
            v-for="item in filteredList"
            :key="item.id"
            style="margin-bottom:10px"
        >
            {{ item.title }}
            <el-select
                :value="item.type"
                @change="type => onChange(type, item)"
            >
                <el-option
                    v-for="path in pathList"
                    :key="path.name"
                    :value="path.name"
                    :label="path.label"
                ></el-option>
            </el-select>
        </div>
    </section>
</template>

<script>
import { getColumns, updateType } from '@/api/column'
import pathList from '@/data/pathList'

export default {
    name: '',
    data() {
        return {
            list: [],
            pathList: pathList,
            selectType: pathList[0].name
        }
    },
    computed: {
        filteredList() {
            return this.list.filter(item => item.type === this.selectType)
        }
    },
    methods: {
        onChange(type, { id }) {
            console.log(type, id)
            updateType({
                id,
                type
            })
        },
        filterList() {
            this.list = this.list.filter(item => !item.type)
        }
    },
    mounted() {
        getColumns().then(res => {
            this.list = res.data
        })
    }
}
</script>

<style lang="" scoped></style>