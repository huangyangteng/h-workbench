<template>
    <section class="doremi-wrapper">
        <section>
            <el-button type="text" @click="init(1)">1个音阶</el-button>
            <el-button type="text" @click="init(2)">2个音阶</el-button>
            <el-button type="text" @click="init(3)">3个音阶</el-button>
            <el-button type="text" @click="init(4)">4个音阶</el-button>
            <el-button type="text" @click="init(5)">5个音阶</el-button>
            <el-button type="text" @click="init(6)">6个音阶</el-button>
            <el-button type="text" @click="init(7)">7个音阶</el-button>
            <span style="margin-left: 20px">自动进行：</span>
            <el-switch v-model="auto"></el-switch>
            <section>{{ count + 1 }}/{{ total }}</section>
            <section class="question" @click="showAnswer">
                {{ curQuestion }}
            </section>
            <section class="answer" v-show="show" @click="next">
                {{ answer }}
            </section>
            <!--            <el-button-->
            <!--                v-for="(item,index) in ['do', 're', 'mi', 'fa', 'sol', 'la', 'si']"-->
            <!--                :key="item"-->
            <!--                type="text"-->
            <!--                @click="playTest(index + 1)"-->
            <!--                >{{ item }}-->
            <!--            </el-button>-->
            <!--            <div>test: <el-input v-model="noteText"></el-input> <el-button @click="playNoteText">play</el-button></div>-->
        </section>
    </section>
</template>

<script>
import hotkeys from 'hotkeys-js'
import MusicBox from './MusicBox'
import PianoSound2 from './PianoSound2'
import { sleep } from '../../../tools'
import PianoPlayer from './PianoPlayer'

const musicMap = {
    1: 'do',
    2: 're',
    3: 'mi',
    4: 'fa',
    5: 'sol',
    6: 'la',
    7: 'si'
}
export default {
    name: 'doremi',
    data() {
        return {
            questionList: [],
            show: false,
            count: 0,
            total: 100,
            music: null,
            piano: null,
            pianoPlayer: null,
            noteText: '',
            size: 3,
            auto: false,
            autoTimer: 0
        }
    },
    computed: {
        curQuestion() {
            return this.questionList[this.count]
        },
        answer() {
            if (!this.curQuestion) return ''
            let list = this.curQuestion.split(' ').map(item => musicMap[item])
            return list.join(' ')
        }
    },
    watch: {
        count() {
            console.log(this.count)
            if (this.count >= this.total) {
                this.init(this.size + 1)
            }
        },
        auto(isAuto) {
            console.log('🍐🍐🍐🍐', isAuto)
            if (isAuto) {
                this.autoNext()
            } else {
                clearInterval(this.autoTimer)
            }
        }
    },
    methods: {
        autoNext() {
            this.autoTimer = setInterval(() => {
                if (this.show) {
                    this.next()
                } else {
                    this.showAnswer()
                }
            }, 5000)
        },
        playNoteText() {
            if (!this.noteText) return
            this.pianoPlayer.playMusic(this.noteText.split('').join(' '))
        },
        async playTest(note) {
            this.pianoPlayer.play(note)
        },
        showAnswer() {
            this.show = true
            if (this.size >= 2) {
                this.piano.playMusic(this.curQuestion)
            } else {
                this.pianoPlayer.playMusic(this.curQuestion)
            }
        },
        next() {
            console.log('next')
            this.show = false

            this.count++
        },
        init(size = 3) {
            this.size = size
            this.clear()

            const getNum = size => {
                let arr = []
                while (size) {
                    arr.push(Math.floor(1 + Math.random() * 7))
                    size--
                }
                return arr.join(' ')
            }
            for (let i = 0; i < this.total; i++) {
                this.questionList.push(getNum(size))
            }
        },
        clear() {
            this.show = false
            this.questionList = []
            this.count = 0
        },
        makeNoise() {
            // this.music.playMusic('1 2 3 4 5 6 7')
            // this.music.createMusic(1)
            // this.music.createMusic(2)
            // this.music.createMusic(3)
        }
    },
    mounted() {
        document.title = '唱名记忆'
        this.init()
        //sine|square|triangle|sawtooth
        this.music = new MusicBox({
            type: 'triangle',
            duration: 3
        })

        this.piano = new PianoSound2()
        this.piano.load()

        this.pianoPlayer = new PianoPlayer()
        this.pianoPlayer.load()

        hotkeys('enter,space', e => {
            e.preventDefault()
            if (this.show) {
                this.next()
            } else {
                this.showAnswer()
            }
        })
    },
    beforeDestroy() {
        hotkeys.unbind('enter')
    }
}
</script>

<style lang="scss" scoped>
.doremi-wrapper {
    text-align: center;
}

.question,
.answer {
    text-align: center;
    padding: 20px;
    font-size: 124px;
}

//.answer {
//    text-align: center;
//    padding: 20px;
//    font-size: 128px;
//}
</style>
