<template>
    <section class="piano-book">
        <el-tree :data="catalogList" @node-click="handleNodeClick" />
        <!--        <div v-for="(menu, index) in menuList" :key="index" style="display: flex;">-->
        <!--            <h4>{{ menu.title }}</h4>-->
        <!--            &lt;!&ndash;            <el-input style="width: 80px;margin-left: 20px;margin-right: 20px" v-model="menu.sort"></el-input>&ndash;&gt;-->
        <!--            <el-input style="width: 80px" v-model="menu.upper"></el-input>-->
        <!--            <el-button @click="save(menu,index)">保存</el-button>-->
        <!--        </div>-->
        <section style="position: absolute;right: 0;top:0">
            <div
                v-for="(menu, index) in catalogList"
                :key="index"
                style="display: flex;"
            >
                <h4>{{ menu.name }}</h4>
                <!--            <el-input style="width: 80px;margin-left: 20px;margin-right: 20px" v-model="menu.sort"></el-input>-->
                <el-input style="width: 80px" v-model="menu.upper"></el-input>
                <el-button @click="save(menu, index)">保存</el-button>
            </div>
        </section>

        <div class="piano-paragraph">
            <div
                v-for="(item, index) in list"
                @dblclick="editItem(index)"
                :key="item.c + '' + index"
            >
                <span>{{ item.c }}</span>
                <span class="ch" v-if="item.ch">{{ item.ch }}</span>
            </div>
        </div>
        <el-input v-model="editText"></el-input>
        <el-button @click="confirmEdit">确认</el-button>
    </section>
</template>

<script>
import { AddCatalog, GetCatalogList } from '../../../api/catalog'
import { Tree } from 'element-ui'
function buildTree(list, id = -1) {
    return list
        .filter(item => item.upper === id)
        .map(item => {
            const children = buildTree(list, item.id)
            if (children.length > 0) {
                return { ...item, children }
            }
            return item
        })
}

export default {
    name: 'piano-book',
    components: {
        [Tree.name]: Tree
    },
    data() {
        return {
            p:
                'A most important learning trick is to choose a short practice segment. This trick has perhaps the largest effect on reducing the practice time because of many reasons.',
            list: [],
            editText: '',
            editIndex: -1,
            menuList: [
                { title: 'I Introduction', sort: 0, upper: -1 },
                { title: 'I.1 Objective', sort: 1, upper: -1 },
                { title: 'I.2 What is Piano Technique?', sort: 2, upper: -1 },
                {
                    title: 'I.3 Technique, Music, and Mental Play',
                    sort: 3,
                    upper: -1
                },
                {
                    title:
                        'I.4 Basic Approach, Interpretation, Musical Training, Perfect Pitch',
                    sort: 4,
                    upper: -1
                },
                {
                    title: 'II Basic Procedures for Piano Practice',
                    sort: 5,
                    upper: -1
                },
                { title: 'II.1 The Practice Routine', sort: 6, upper: -1 },
                { title: 'II.2 Finger Positions', sort: 7, upper: -1 },
                {
                    title: 'II.3 Bench Height and Distance from Piano',
                    sort: 8,
                    upper: -1
                },
                {
                    title:
                        'II.4 Starting a Piece: Listening and Analysis (Fur Elise)',
                    sort: 9,
                    upper: -1
                },
                {
                    title: 'II.5 Practice the Most Difficult Sections First',
                    sort: 10,
                    upper: -1
                },
                {
                    title:
                        'II.6 Shortening Difficult Passages: Segmental (Bar-by-Bar) Practice',
                    sort: 11,
                    upper: -1
                },
                {
                    title: 'II.7 Hands Separate Practice: Acquiring Technique',
                    sort: 12,
                    upper: -1
                },
                { title: 'II.8 Continuity Rule', sort: 13, upper: -1 },
                { title: 'II.9 Chord Attack', sort: 14, upper: -1 },
                {
                    title: 'II.10 Gravity Drop, Chord Practice, and Relaxation',
                    sort: 15,
                    upper: -1
                },
                { title: 'II.11 Parallel Sets', sort: 16, upper: -1 },
                {
                    title: 'II.12 Learning, Memorizing, Mental Play',
                    sort: 17,
                    upper: -1
                },
                {
                    title: 'II.13 Velocity, Choice of Practice Speed',
                    sort: 18,
                    upper: -1
                },
                { title: 'II.14 How to Relax', sort: 19, upper: -1 },
                {
                    title: 'II.15 Post Practice Improvement (PPI)',
                    sort: 20,
                    upper: -1
                },
                {
                    title:
                        'II.16 Dangers of Slow Play - Pitfalls of the Intuitive Method',
                    sort: 21,
                    upper: -1
                },
                { title: 'II.17 Importance of Slow Play', sort: 22, upper: -1 },
                { title: 'II.18 Fingering', sort: 23, upper: -1 },
                {
                    title: 'II.19 Accurate Tempo and the Metronome',
                    sort: 24,
                    upper: -1
                },
                {
                    title:
                        'II.20 Weak Left Hand; Using One Hand to Teach the Other',
                    sort: 25,
                    upper: -1
                },
                {
                    title: 'II.21 Building Endurance, Breathing',
                    sort: 26,
                    upper: -1
                },
                {
                    title: "II.22 Bad Habits: A Pianist's Worst Enemy",
                    sort: 27,
                    upper: -1
                },
                { title: 'II.23 Damper Pedal', sort: 28, upper: -1 },
                {
                    title:
                        'II.24 Soft Pedal, Hammer Voicing and Physics of the Piano Sound',
                    sort: 29,
                    upper: -1
                },
                {
                    title: 'II.25 Hands Together and Mental Play',
                    sort: 30,
                    upper: -1
                },
                {
                    title: "II.25.1 Beethoven's Moonlight, 1st Movement",
                    sort: 31,
                    upper: -1
                },
                {
                    title:
                        "II.25.2 Mozart's Rondo Alla Turca from Sonata K300 (301)",
                    sort: 32,
                    upper: -1
                },
                {
                    title: "II.25.3 Chopin's Fantaisie Impromptu",
                    sort: 33,
                    upper: -1
                },
                { title: 'II.26 Summary', sort: 34, upper: -1 },
                {
                    title: 'III Selected Topics in Piano Practice',
                    sort: 35,
                    upper: -1
                },
                {
                    title: 'III.1 Tone, Rhythm, Legato, Staccato',
                    sort: 36,
                    upper: -1
                },
                { title: 'III.1.1 What is Good Tone?', sort: 37, upper: -1 },
                {
                    title:
                        'III.1.1.1 The Basic Keystroke, Pianissimo, Fortissimo',
                    sort: 38,
                    upper: -1
                },
                {
                    title: 'III.1.1.2 Tone: Single versus Multiple Notes',
                    sort: 39,
                    upper: -1
                },
                {
                    title:
                        "III.1.2 What is Rhythm? (Beethoven's Tempest, Op.31, #2, Appassionata, Op. 57)",
                    sort: 40,
                    upper: -1
                },
                { title: 'III.1.3 Legato, Staccato', sort: 41, upper: -1 },
                {
                    title: "III.2 Cycling (Chopin's Fantaisie Impromptu)",
                    sort: 42,
                    upper: -1
                },
                { title: 'III.3 Trills & Tremolos', sort: 43, upper: -1 },
                { title: 'III.3.1 Trills', sort: 44, upper: -1 },
                {
                    title:
                        "III.3.2 Tremolos (Beethoven's Pathetique, 1st Mvmnt)",
                    sort: 45,
                    upper: -1
                },
                {
                    title: 'III.4 Hand, Finger, Body Motions for Technique',
                    sort: 46,
                    upper: -1
                },
                {
                    title:
                        'III.4.1 Hand Motions: Pronation, Supination, Thrust, Pull, Claw, Throw, Flick, Wrist',
                    sort: 47,
                    upper: -1
                },
                {
                    title: 'III.4.2 Playing with Flat Fingers',
                    sort: 48,
                    upper: -1
                },
                { title: 'III.4.3 Body Motions', sort: 49, upper: -1 },
                {
                    title:
                        'III.5 Playing Fast: Scales, Arpeggios and Chromatic Scales',
                    sort: 50,
                    upper: -1
                },
                {
                    title: 'III.5.1 Scales: Thumb Under, Thumb Over',
                    sort: 51,
                    upper: -1
                },
                {
                    title: 'III.5.2 The TO Motion, Explanation and Video',
                    sort: 52,
                    upper: -1
                },
                { title: 'III.5.3 Practicing TO, Speed', sort: 53, upper: -1 },
                {
                    title:
                        'III.5.4 Scales: Origin, Nomenclature, and Fingerings',
                    sort: 54,
                    upper: -1
                },
                {
                    title:
                        "III.5.5 Arpeggios (Chopin's FI, Cartwheel Motion, Finger Splits)",
                    sort: 55,
                    upper: -1
                },
                {
                    title:
                        "III.5.6 Thrust and Pull, Beethoven's Moonlight, 3rd Movement",
                    sort: 56,
                    upper: -1
                },
                {
                    title:
                        'III.5.7 Thumb: the Most Versatile Finger; Examples of Scale/Arpeggio Practice Routines',
                    sort: 57,
                    upper: -1
                },
                { title: 'III.5.8 Fast Chromatic Scales', sort: 58, upper: -1 },
                { title: 'III.6 Memorizing', sort: 59, upper: -1 },
                { title: 'III.6.1 Why Memorize?', sort: 60, upper: -1 },
                {
                    title: 'III.6.2 Who can, What to, and When to, Memorize',
                    sort: 61,
                    upper: -1
                },
                {
                    title: 'III.6.3 Memorizing and Maintenance',
                    sort: 62,
                    upper: -1
                },
                { title: 'III.6.4 Hand Memory', sort: 63, upper: -1 },
                {
                    title: 'III.6.5 Starting the Memorizing Process',
                    sort: 64,
                    upper: -1
                },
                {
                    title: 'III.6.6 Reinforcing the Memory',
                    sort: 65,
                    upper: -1
                },
                { title: 'III.6.7 Practicing Cold', sort: 66, upper: -1 },
                { title: 'III.6.8 Slow Play', sort: 67, upper: -1 },
                { title: 'III.6.9 Mental Timing', sort: 68, upper: -1 },
                {
                    title:
                        'III.6.10 Establishing Permanent Memory -- Mental Play',
                    sort: 69,
                    upper: -1
                },
                { title: 'III.6.10.1 Music Memory', sort: 70, upper: -1 },
                {
                    title: 'III.6.10.2 Photographic Memory',
                    sort: 71,
                    upper: -1
                },
                {
                    title: 'III.6.10.3 Keyboard Memory -- Mental Play',
                    sort: 72,
                    upper: -1
                },
                { title: 'III.6.10.4 Theoretical Memory', sort: 73, upper: -1 },
                { title: 'III.6.11 Maintenance', sort: 74, upper: -1 },
                {
                    title:
                        "III.6.12 Sight Readers versus Memorizers: Learning Bach's Inventions",
                    sort: 75,
                    upper: -1
                },
                {
                    title: 'III.6.12.1 Inventions #1, #8, #13',
                    sort: 76,
                    upper: -1
                },
                { title: 'III.6.12.2 Quiet Hands', sort: 77, upper: -1 },
                { title: 'III.6.12.3 Sinfonia #15', sort: 78, upper: -1 },
                {
                    title:
                        'III.6.13 Human Memory Function; Music = Memory Algorithm',
                    sort: 79,
                    upper: -1
                },
                {
                    title: 'III.6.14 How to Become a Good Memorizer',
                    sort: 80,
                    upper: -1
                },
                { title: 'III.6.15 Summary', sort: 81, upper: -1 },
                { title: 'III.7 Exercises', sort: 82, upper: -1 },
                {
                    title:
                        'III.7.1 Introduction: Intrinsic, Limbering, and Conditioning Exercises',
                    sort: 83,
                    upper: -1
                },
                {
                    title: 'III.7.1.1 Fast versus Slow Muscles',
                    sort: 84,
                    upper: -1
                },
                {
                    title:
                        'III.7.2 Parallel Set Exercises for Intrinsic Technical Development',
                    sort: 85,
                    upper: -1
                },
                {
                    title:
                        "III.7.3 How To Use The Parallel Set Exercises (Beethoven's Appassionata, 3rd Movement)",
                    sort: 86,
                    upper: -1
                },
                {
                    title:
                        'III.7.4 Scales, Arpeggios, Finger Independence and Finger Lifting Exercises',
                    sort: 87,
                    upper: -1
                },
                {
                    title:
                        'III.7.5 Playing (Wide) Chords, Finger/Palm Spreading Exercises',
                    sort: 88,
                    upper: -1
                },
                { title: 'III.7.6 Practicing Jumps', sort: 89, upper: -1 },
                {
                    title: 'III.7.7 Stretching and Other Exercises',
                    sort: 90,
                    upper: -1
                },
                {
                    title: 'III.7.8 Problems with Hanon Exercises',
                    sort: 91,
                    upper: -1
                },
                { title: 'III.7.9 Practicing for Speed', sort: 92, upper: -1 },
                {
                    title: 'III.7.9.1 Speed Stroke, Relaxation',
                    sort: 93,
                    upper: -1
                },
                { title: 'III.7.9.2 Other Speed Methods', sort: 94, upper: -1 },
                { title: 'III 7.9.3 Speed Walls', sort: 95, upper: -1 },
                {
                    title: "III.8 Outlining (Beethoven's Sonata #1, Op.2, #1)",
                    sort: 96,
                    upper: -1
                },
                {
                    title: 'III.9 Polishing a Piece - Eliminating Flubs',
                    sort: 97,
                    upper: -1
                },
                {
                    title:
                        'III.10 Cold Hands, Slippery (Dry/Sweaty) Fingers, Illness, Hand Injury (Carpal Tunnel), Ear Damage (Tinnitus)',
                    sort: 98,
                    upper: -1
                },
                { title: 'III.11 Sight Reading', sort: 99, upper: -1 },
                {
                    title:
                        'III.12 Learning Relative Pitch and Perfect Pitch (Sight Singing)',
                    sort: 100,
                    upper: -1
                },
                {
                    title: 'III.13 Videotaping and Recording Your Own Playing',
                    sort: 101,
                    upper: -1
                },
                {
                    title: 'III.14 Preparing for Performances and Recitals',
                    sort: 102,
                    upper: -1
                },
                {
                    title:
                        'III.14.1 Benefits and Pitfalls of Performances/Recitals',
                    sort: 103,
                    upper: -1
                },
                {
                    title: 'III.14.2 Basics of Flawless Performances',
                    sort: 104,
                    upper: -1
                },
                {
                    title: 'III.14.3 Practicing for Performances',
                    sort: 105,
                    upper: -1
                },
                {
                    title: 'III.14.4 Practicing Musically',
                    sort: 106,
                    upper: -1
                },
                { title: 'III.14.5 Casual Performances', sort: 107, upper: -1 },
                {
                    title: 'III.14.6 Performance Preparation Routines',
                    sort: 108,
                    upper: -1
                },
                { title: 'III.14.7 During the Recital', sort: 109, upper: -1 },
                {
                    title: 'III.14.8 That Unfamiliar Piano',
                    sort: 110,
                    upper: -1
                },
                { title: 'III.14.9 After the Recital', sort: 111, upper: -1 },
                {
                    title: 'III.15 Origin and Control of Nervousness',
                    sort: 112,
                    upper: -1
                },
                { title: 'III.16 Teaching', sort: 113, upper: -1 },
                { title: 'III.16.1 Types of Teachers', sort: 114, upper: -1 },
                {
                    title: 'III.16.2 Teaching Youngsters, Parental Involvement',
                    sort: 115,
                    upper: -1
                },
                {
                    title:
                        'III.16.3 Memorizing, Reading, Theory, Mental Play, Absolute Pitch',
                    sort: 116,
                    upper: -1
                },
                {
                    title:
                        'III.16.4 Some Elements of Piano Lessons – Performance Skills',
                    sort: 117,
                    upper: -1
                },
                {
                    title: 'III.16.5 Why the Greatest Pianists Could Not Teach',
                    sort: 118,
                    upper: -1
                },
                {
                    title:
                        'III.17 Uprights, Grands, & Electronics, Purchasing and Care',
                    sort: 119,
                    upper: -1
                },
                {
                    title: 'III.17.1 Grands, Uprights, or Electronics?',
                    sort: 120,
                    upper: -1
                },
                { title: 'III.17.2 Electronic Pianos', sort: 121, upper: -1 },
                { title: 'III.17.3 Uprights', sort: 122, upper: -1 },
                { title: 'III.17.4 Grands', sort: 123, upper: -1 },
                {
                    title: 'III.17.5 Purchasing an Acoustic Piano',
                    sort: 124,
                    upper: -1
                },
                { title: 'III.17.6 Piano Care', sort: 125, upper: -1 },
                {
                    title:
                        'III.18 How to Start Learning Piano: Youngest Children to Old Adults',
                    sort: 126,
                    upper: -1
                },
                {
                    title: 'III.18.1 Do You Need a Teacher?',
                    sort: 127,
                    upper: -1
                },
                {
                    title: 'III.18.2 Starter Books and Keyboards',
                    sort: 128,
                    upper: -1
                },
                {
                    title: 'III.18.3 Beginners: Age 0 to 65+',
                    sort: 129,
                    upper: -1
                },
                {
                    title:
                        'III.19 The "Ideal" Practice Routine (Bach\'s Teachings and Invention #4)',
                    sort: 130,
                    upper: -1
                },
                { title: 'III.19.1 Learning the Rules', sort: 131, upper: -1 },
                {
                    title:
                        'III.19.2 Routine for Learning a New Piece (Bach Inv. #4)',
                    sort: 132,
                    upper: -1
                },
                {
                    title:
                        'III.19.3 "Normal" Practice Routines and Bach\'s Teachings',
                    sort: 133,
                    upper: -1
                },
                {
                    title:
                        'III.20 Bach: the Greatest Composer and Teacher (15 Inventions and their parallel sets)',
                    sort: 134,
                    upper: -1
                },
                {
                    title: 'III.21 The Psychology of Piano',
                    sort: 135,
                    upper: -1
                },
                { title: 'III.22 Summary of Method', sort: 136, upper: -1 },
                {
                    title: 'IV Music, Mathematics, and Research',
                    sort: 137,
                    upper: -1
                },
                { title: 'IV.1 Can We All be Mozarts?', sort: 138, upper: -1 },
                {
                    title: 'IV.2 Scientific Approach to Piano Practice',
                    sort: 139,
                    upper: -1
                },
                { title: 'IV.2.1 The Scientific Method', sort: 140, upper: -1 },
                {
                    title: 'IV.2.2 Principles of Learning',
                    sort: 141,
                    upper: -1
                },
                {
                    title: 'IV.3 Why Is Intuition So Often Wrong?',
                    sort: 142,
                    upper: -1
                },
                {
                    title: "IV.4 Mozart's Formula, Beethoven and Group Theory",
                    sort: 143,
                    upper: -1
                },
                {
                    title:
                        'IV.5 Learning Rate Calculation (1000 Times Faster!)',
                    sort: 144,
                    upper: -1
                },
                { title: 'IV.6 Future Research Topics', sort: 145, upper: -1 },
                {
                    title: 'IV.6.1 Momentum Theory of Piano Playing',
                    sort: 146,
                    upper: -1
                },
                {
                    title: 'IV.6.2 The Physiology of Technique',
                    sort: 147,
                    upper: -1
                },
                {
                    title: 'IV.6.3 Brain Research (HS vs HT Play, etc.)',
                    sort: 148,
                    upper: -1
                },
                { title: 'IV.6.4 The Future of Piano', sort: 149, upper: -1 },
                {
                    title: 'IV.6.5 The Future of Education',
                    sort: 150,
                    upper: -1
                }
            ],
            catalogList: []
        }
    },
    computed: {},
    methods: {
        handleNodeClick(arg) {
            console.log(arg)
        },
        async fetchMenu() {
            const res = await GetCatalogList()
            console.log(res.data)
            this.catalogList = buildTree(
                res.data.map(item => ({
                    ...item,
                    label: item.name
                }))
            )
            console.log(this.catalogList)
        },
        save(item, index) {
            console.log(item)
            AddCatalog({
                name: item.title,
                sort: item.sort,
                bookid: 1,
                upper: item.upper
            })
        },
        splitP() {
            this.list = this.p.split(' ').map(item => ({
                c: item,
                ch: '',
                b: 0
            }))
        },
        editItem(index) {
            this.editIndex = index
        },
        confirmEdit() {
            if (this.editIndex < 0) return
            this.list.splice(this.editIndex, 1, {
                ...this.list[this.editIndex],
                ch: this.editText
            })
        }
    },
    created() {
        this.splitP()
        this.fetchMenu()
    }
}
</script>

<style lang="scss" scoped>
.piano-book {
    width: 1200px;
    margin: 30px auto;
}

.piano-paragraph {
    display: flex;
    flex-wrap: wrap;
    width: 800px;
    font-size: 24px;

    div {
        margin-right: 5px;
        margin-bottom: 16px;
        position: relative;

        .ch {
            position: absolute;
            font-size: 12px;
            white-space: nowrap;
            left: 2px;
            bottom: 0;
            margin-bottom: -20px;
            font-weight: 500;
        }
    }
}
</style>
