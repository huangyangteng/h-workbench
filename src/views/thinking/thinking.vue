<template>
    <!--    <star-bg class="thinking-wrapper  animate__animated animate__fadeIn">-->
    <section class="thinking-wrapper">
        <section class="thinking-content">
            <thinking-tools></thinking-tools>
            <nav class="thinking-nav">
                <h1>
                    Write down your thoughts
                    <i
                        class="el-icon-ice-cream-round click-big animate__fadeInLeft animate__animated delay-4s"
                        style="color:#fff"
                        @click="toggleMoving"
                    ></i>
                </h1>
                <el-input
                    v-model="searchKey"
                    class="search"
                    style="width: 220px"
                    prefix-icon="el-icon-search"
                    size="mini"
                    clearable
                ></el-input>
            </nav>
            <add-notes @add="add"></add-notes>
            <section
                class="note-list"
                :style="{ filter: showMask ? 'blur(3px)' : 'blur(0)' }"
            >
                <note-item
                    v-for="item in exhibitNotes"
                    :note="item"
                    :key="item.id"
                    @delete="deleteItem"
                    @modify="modify"
                ></note-item>
            </section>
        </section>
        <CountDown></CountDown>
    </section>
    <!--    </star-bg>-->
</template>

<script>
import AddNotes from '../Workbench/components/video/add-notes'
import NoteItem from '../Workbench/components/video/note-item'
import StarBg from './star-bg'
import { mapGetters } from 'vuex'
import { NOTE_API } from '../../api/note'
import { eventBus } from '../../tools'
import ThinkingTools from './thinking-tools'
import CountDown from '../../components/CountDown'

export default {
    name: 'thinking',
    components: { CountDown, ThinkingTools, NoteItem, AddNotes },
    data() {
        return {
            searchKey: '',
            isMoving: true,
            notes: [
                {
                    currentTime: 20,
                    date: '2020-11-22 03:04:05',
                    value: `帘外雨潺潺，春意阑珊，罗衾不耐五更寒。梦里不知身是客，一晌贪欢。独自莫凭栏，无限江山，别时容易见时难。流水落花春去也，天上人间。`
                }
            ],
            showMask: false
        }
    },
    computed: {
        ...mapGetters('user', ['userId']),
        exhibitNotes() {
            if (this.searchKey) {
                return this.notes.filter(item =>
                    item.value.toLowerCase().includes(this.searchKey)
                )
            } else {
                return this.notes
            }
        }
    },
    methods: {
        toggleMoving() {
            // this.isMoving = !this.isMoving
            // eventBus.$emit('star-moving', this.isMoving)
            this.showMask = !this.showMask
        },
        async query() {
            const res = await NOTE_API.query(this.userId)
            this.notes = res.data
            console.log(res)
        },
        async add(value) {
            const res = await NOTE_API.add({
                value,
                userId: this.userId
            })
            console.log(res)
            this.query()
        },
        async deleteItem({ id }) {
            await NOTE_API.del({ id })
            this.query()
        },
        async modify(data) {
            await NOTE_API.update({
                ...data,
                userId: this.userId
            })
            this.query()
        }
    },
    created() {
        this.query()
    }
}
</script>
<style lang="scss">
.thinking-nav {
    input {
        background: $component-bg-color;
    }
}
</style>
<style lang="scss" scoped>
.thinking-wrapper {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    //background-image: url('http://static.simpledesktops.com/uploads/desktops/2017/06/02/bg-wallpaper.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
}

@keyframes textFade {
    from {
        background-position-x: 100%;
    }

    to {
        background-position-x: 0%;
    }
}

.thinking-content {
    max-width: 960px;
    margin: 0 auto;
    height: 100vh;
    padding: 20px 10px;
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.thinking-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .search {
    }

    h1 {
        font-size: 14px;
        white-space: nowrap;
        letter-spacing: 0.3px;
        background-image: linear-gradient(
            75deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 1) 33.33%,
            rgba(255, 255, 255, 0) 66.67%,
            rgba(255, 255, 255, 0) 100%
        );
        background-size: 300% 100%;

        -webkit-background-clip: text;
        color: transparent !important;
        animation: 2s textFade ease-in-out;
        background-position-x: 0%;
    }
}

.note-list {
    margin-top: 30px;
    height: calc(100vh - 100px);
    overflow-y: auto;
    transition: 0.3s;
    //filter: blur(5px);
}

.note-list:hover {
    filter: blur(0px) !important;
}
</style>
