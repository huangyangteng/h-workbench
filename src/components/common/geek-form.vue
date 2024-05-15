<template>
    <section>
        <el-form ref="form" :model="form" label-width="80px">
            <template v-for="(item, index) in rules">
                <slot :name="'item_' + index"></slot>
                <el-form-item :key="item.name" :label="item.label">
                    <el-input
                        v-if="item.type === 'input'"
                        v-model="form[item.name]"
                        @blur="
                            $emit('blur', {
                                key: item.name,
                                value: form[item.name]
                            })
                        "
                    ></el-input>
                    <el-select
                        v-model="form[item.name]"
                        v-if="item.type === 'select'"
                    >
                        <el-option
                            v-for="child in item.list"
                            :key="child.value"
                            :label="child.label"
                            :value="child.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button @click="submit" type="text">提交</el-button>
            </el-form-item>
            <slot :name="'item_' + rules.length"></slot>
        </el-form>
    </section>
</template>

<script>
export default {
    name: 'geek-form',
    props: {
        rules: Array,
        submitMap: Object,
        submitKey: String
    },
    watch: {
        rules: {
            immediate: true,
            handler() {
                this.form = this.rules.reduce((obj, cur) => {
                    if (cur.initValue) {
                        obj[cur.name] = cur.initValue
                    }
                    return obj
                }, {})
            }
        },
        form: {
            deep: true,
            handler() {
                console.log('hh')
                this.$emit('on-change', this.form)
            }
        }
    },
    data() {
        return {
            form: null
        }
    },
    computed: {
        submitApi() {
            return this.submitMap[this.submitKey]
        }
    },
    methods: {
        async submit() {
            const res = await this.submitApi(this.form)
            this.$emit('success', {
                key: this.submitKey,
                data: res.data
            })
        },
        setName(name) {
            this.$set(this.form, 'name', name)
        }
    },
    created() {}
}
</script>

<style lang="" scoped></style>
