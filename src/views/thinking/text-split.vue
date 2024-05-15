<template>
    <section class="text-split">
        <aside>
            <div>
                <h2 @click="formatEnStr">english</h2>
                <el-input
                    v-model="enStr"
                    @change="formatEnStr"
                    type="textarea"
                    :autosize="{ minRows: 10, maxRows: 50 }"
                />
            </div>
            <div>
                <h2 @click="formatChStr">chinese</h2>
                <el-input
                    v-model="chStr"
                    @change="formatChStr"
                    type="textarea"
                    :autosize="{ minRows: 10, maxRows: 50 }"
                />
            </div>
        </aside>
        <main>
            <h2 @click="copy">output</h2>
            <el-input
                v-model="output"
                type="textarea"
                :autosize="{ minRows: 22, maxRows: 50 }"
            />
        </main>
    </section>
</template>

<script>
import { copyToBoard } from '../../tools'

function getNewStr(strEnglish, strChinese) {
    strEnglish = strEnglish.replace(/\n/g, '')
    strChinese = strChinese.replace(/\n/g, '')
    let en = strEnglish.split('.')
    let ch = strChinese.split('。')

    let list = []
    for (let i = 0; i < en.length; i++) {
        if (ch[i] && en[i]) {
            list.push(ch[i] + '。\n' + en[i] + '.')
        }
    }
    return list.join(' \n\n ')
}

export default {
    name: 'text-splite',
    data() {
        return {
            enStr: ``,
            chStr: ``
        }
    },
    computed: {
        output() {
            if (!this.enStr) return ''
            if (!this.chStr) return ''
            return getNewStr(this.enStr, this.chStr)
        }
    },
    methods: {
        copy() {
            copyToBoard(this.output)
            this.$Message.success('复制成功')
        },
        test() {
            this.enStr = `Much of the language used to describe monetary policy, such as "steering the economy to a soft landing" or "a touch on the brakes", makes it sound like a precise science. Nothing could be further
          from the truth. The link between interest rates and inflation is uncertain. And there are long, variable
          lags before policy changes have any effect on the economy. Hence the analogy that likens the conduct of monetary policy to driving a car with a blackened windscreen, a cracked rearview mirror
          and a faulty steering wheel.
              Given all these disadvantages, central bankers seem to have had much to boast about of late.
              Average inflation in the big seven industrial economies fell to a mere 2.3% last year, close to its lowest level in 30 years, before rising slightly to 2.5% this July. This is a long way below the double- digit rates which many countries experienced in the 1970s and early 1980s.
              It is also less than most forecasters had predicted. In late 1994 the panel of economists which
          The Economist polls each month said that America's inflation rate would average 3.5% in 199s. In act, it fell to 2.6% in August, and is expected to average only about 3% for the year as a whole. In Britain and Japan inflation is running half a percentage point below the rate predicted at the end of
          last year. This is no flash in the pan; over the past couple of years, inflation has been consistently
          lower than expected in Britain and America.
              Economists have been particularly surprised by favourable inflation figures in Britain and the United States, since conventional measures suggest that both economies, and especially America's, have little productive slack. America's capacity utilisation, for example, hit historically high levels earlier this year, and its jobless rate (5.6% in August) has fallen below most estimates of the natural rate of unemployment - the rate below which inflation has taken off in the past.
              Why has inflation proved so mild? The most thrilling explanation is, unfortunately, a little defective. Some economists argue that powerful structural changes in the world have upended the old economic models that were based upon the historical link between growth and inflation.`

            this.chStr = `Much 用来描述货币政策的许多术语，如“引导经济软着陆”“踩刹车”，使货币政策听起来像是一门很精确的科学。Nothing但事实远非如此，利率和通货膨胀之间的关系是不确定的。在政策变化对经济产生影响之前,其会有一段较长而且变化不定的滞后期。Hence所以才会出现这样的类比:把实施货币政策比作是驾驶一辆挡风玻璃污痕累累、后视镜裂纹密布、而且方向盘已经失灵的汽车。
Given考虑到所有这些不利的因素，中央银行家们似乎觉得近来有一些值得夸耀的东西。Average西方七大工业经济大国去年的平均通货膨胀率降到了2.3%,接近30年来的最低水平，今年7月略微升高到2.5%。This 但这远远低于许多国家在 70年代和 80 年代早期经历的两位数的通货膨胀率。
这数据也低于大多数预测者预测的数据。1994年底，《经济学家》每月进行调查的经济学专家小组认为，美国1995年通货膨胀率平均值可能为3.5%。In fact实际上，通货膨胀率 8月份就降到了2.6%,而且全年预期平均只有3%左右。In Britain 在英国和日本，通货膨胀率比去年年底预测的要低 0.5 个百分点。This 这种低通货膨胀率并不是昙花一现，在英国和美国，通货膨胀率在过去几年里始终低于预测水平。
Economists英美两国温和的通货膨胀率使经济学家(感到)特别吃惊，因为传统的判断尺度表明，这两个经济大国，特别是美国经济几乎没有出现生产萧条。America's 比如，美国的生产力(的)利用在今年早些时候达到了历史最高水平,失业率(8月份为5.6%)已低于大多数人对自然失业率的估计--在过去,如果失业率低于自然失业率，通货膨胀率就会迅速上升。
Why为何通货膨胀是如此的温和呢？遗憾的是，最令人兴奋的解释也有一点不完美。Some 旧的经济模式一直是基于经济发展与通货膨胀之间的历史关系，但是现在,一些经济学家认为世界经济结构的巨大变化已经顛覆了这种旧的经济模式。
`
        },
        formatEnStr() {
            let str = this.enStr
                .replace(/\n/g, '')
                .replace(/(\d+)\.(\d+)/g, '$1·$2')
                .replace(/\n/g, '')
            this.enStr = str.split('.').join('.\n\n')
        },
        formatChStr() {
            this.chStr = this.chStr
                .replace(/\n/g, '')
                .split('。')
                .join('。\n\n')
        }
    },
    created() {
        // this.test()
    }
}
</script>

<style lang="scss">
.text-split {
    display: flex;
    padding: 20px;
    height: 100vh;

    > aside {
        flex: 1;
        margin-right: 20px;
        height: 100%;
        overflow-y: auto;
        display: flex;

        > div {
            flex: 1;
            overflow-y: auto;
            margin-right: 10px;
        }
    }

    > main {
        flex: 1;
        height: 100%;
        overflow-y: auto;
    }

    textarea {
        background: $component-bg-color;
    }
}
</style>
