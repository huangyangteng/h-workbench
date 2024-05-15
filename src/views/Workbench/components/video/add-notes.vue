<template>
    <div class="add-note-wrapper">
        <el-input
            @keydown.enter.native="keyDown"
            ref="input"
            :autosize="{ minRows: 3 }"
            type="textarea"
            v-model="text"
        />
        <br />
        <el-button size="mini" plain type="primary" @click="emitAddNote"
            >添加
        </el-button>
    </div>
</template>

<script>
// 主题色：两个主题色变量
import hotkeys from 'hotkeys-js'

export default {
    name: 'add-notes',
    data() {
        return {
            text: ''
        }
    },
    computed: {},
    methods: {
        keyDown(e) {
            if (e.ctrlKey || e.metaKey) {
                this.emitAddNote()
            }
        },
        emitAddNote() {
            if (this.text) {
                this.$emit('add', this.text)
                setTimeout(() => {
                    this.text = ''
                }, 1000)
            }
        },
        focusText() {
            this.$nextTick(() => {
                this.$refs.input.focus({
                    cursor: 'start'
                })
            })
        }
    },
    mounted() {
        hotkeys('ctrl+alt+m', e => {
            e.preventDefault()
            this.focusText()
        })

        this.focusText()
    },
    beforeDestroy() {
        hotkeys.unbind('ctrl+alt+m')
    }
}
</script>

<style lang="scss">
.add-note-wrapper {
    text-align: right;
    background: $component-bg-color;
    border-radius: 6px;
    padding: 5px;
    margin-bottom: 15px;
    position: relative;

    > button {
        position: absolute;
        right: 5px;
        bottom: 5px;
    }

    textarea {
        background: $component-bg-color;
        color: $font-color;
        border: 0;
        outline: 0;
        resize: none;
        width: 100%;
        caret-color: #333;

        &:focus {
            border: 0;
            box-shadow: none;
        }
    }
}
</style>
