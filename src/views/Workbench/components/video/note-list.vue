<template>
    <section>
        <add-notes @add="addNote"></add-notes>
        <div class="sort-note">
            <b>排序：</b>
            <span :class="{ active: sortByAddTime }" @click="sortBy = 'addTime'"
                >按添加时间</span
            >
            <span
                :class="{ active: !sortByAddTime }"
                @click="sortBy = 'videoTime'"
                >按视频时间</span
            >
        </div>
        <note-item
            v-for="item in sortedNotes"
            :key="item.id"
            :note="item"
            @delete="deleteText"
            @modify="modifyText"
            @set-time="setTime"
        ></note-item>
    </section>
</template>

<script>
// 主题色：两个主题色变量
import addNotes from './add-notes'
import NoteItem from './note-item'
import dayjs from 'dayjs'
import { deepCopy } from '../../../../tools'

export const OPERATE = {
    ADD: 'add',
    MODIFY: 'modify',
    DELETEE: 'delete',
    SET_TIME: 'setTime'
}
export default {
    name: 'note-list',
    props: {
        notes: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            sortBy: 'addTime'
        }
    },
    computed: {
        sortByAddTime() {
            return this.sortBy == 'addTime'
        },
        sortedNotes() {
            let notes = deepCopy(this.notes)
            if (this.sortByAddTime) {
                //按添加时间
                notes.sort((r1, r2) => {
                    return dayjs(r2.date).valueOf() - dayjs(r1.date).valueOf()
                })
            } else {
                notes.sort((r1, r2) => {
                    return r2.currentTime - r1.currentTime
                })
            }
            return notes
        }
    },
    components: {
        addNotes,
        NoteItem
    },
    methods: {
        emitText(data, operate) {
            this.$emit('change', {
                data,
                operate
            })
        },
        editText() {},
        deleteText(payload) {
            this.emitText(payload, OPERATE.DELETEE)
        },
        modifyText(payload) {
            this.emitText(payload, OPERATE.MODIFY)
        },
        addNote(value) {
            this.emitText({ value }, OPERATE.ADD)
        },
        setTime({ currentTime }) {
            this.emitText({ currentTime }, OPERATE.SET_TIME)
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.sort-note {
    padding: 10px;

    > span {
        margin-right: 5px;
        cursor: pointer;
    }

    > span.active {
        color: $font-color;
        transform: scale(1.1);
    }
}
</style>
