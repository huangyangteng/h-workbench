<template>
    <section style="display: flex;padding:20px">
        <aside style="width: 320px;margin-right: 10px">
            <geek-form
                ref="form"
                @success="onSuccess"
                @blur="onBlur"
                :rules="addForm"
                :submitMap="submitMap"
                :submit-key="submitKey"
            >
            </geek-form>
        </aside>
        <geek-table ref="table" style="flex:1" :api="GetReadList"></geek-table>
    </section>
</template>

<script>
import GeekTable from '../../../components/common/geek-table'

import {
    GetReadList,
    AddRead,
    UpdateRead,
    GetTitleFromLink
} from '../../../api/read'
import GeekForm from '../../../components/common/geek-form'

const TYPE_LIST = ['工作', '学习', '生活'].map(item => ({
    label: item,
    value: item
}))
const TAG_LIST = ['前端', '后端', '英语', '算法', '工具']

export default {
    name: 'read-push',
    components: { GeekForm, GeekTable },
    data() {
        return {
            GetReadList,
            addForm: [
                { type: 'input', name: 'link', label: 'link', initValue: '' },
                { type: 'input', name: 'name', label: 'name', initValue: '' },
                {
                    type: 'select',
                    name: 'type',
                    label: '分类',
                    list: TYPE_LIST,
                    initValue: '工作'
                }
            ],
            submitMap: {
                add: AddRead,
                update: UpdateRead
            },
            submitKey: 'add'
        }
    },
    computed: {},
    methods: {
        async onBlur({ key, value }) {
            console.log(key, value)
            if (key === 'link' && value) {
                const title = (await GetTitleFromLink(value)).data
                let index = this.addForm.findIndex(item => item.name === 'name')
                if (index === -1) return
                this.$refs.form.setName(title)
            }
        },
        onSuccess({ key, data }) {
            console.log(key, data)
            this.$refs.table.getList()
        }
    },
    created() {}
}
</script>

<style lang="" scoped></style>
