<template>
    <section class="piano-text">
        <nav>
            <el-button type="text" @click="format">format</el-button>
            <el-button type="text" @click="copy">copy</el-button>
        </nav>
        <section>
            <el-input
                style="font-size:24px;font-family:monospace"
                v-model="str"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 50 }"
            />
        </section>
    </section>
</template>

<script>
import { copyToBoard } from '../../tools'

/**
 * 断开文本
 * @param str
 * @param size
 * @returns {unknown[]}
 */
function splitText(str, size = 80) {
    let cur = 0
    let total = str.length
    let list = []

    let time = 1
    let times = Math.ceil(total / size)
    while (times > 0) {
        let index = str.indexOf(' ', size * time)
        if (index === -1) {
            index = total
        }
        let substr = str.slice(cur, index) //0 84   84 163  163 248
        if (substr) {
            list.push(substr)
        }
        cur = index
        time++
        times--
    }
    return list.map(item => {
        if (item[0] === ' ') {
            return item.slice(1)
        } else {
            return item
        }
    })
    // return list
}

const isTitle = str => {
    //字符长度大于200，默认为不是title
    if (str.length > 200) return false
    // 取最后一个字符,不是.并且字符长度较小
    if (str[str.length - 1] !== '.' && str.length < 120) {
        return true
    }
    // 不包含
    let list = ['//', '.', '=']
    return list.every(code => {
        return !str.includes(code)
    })
}
const space = len => {
    return ' '.repeat(len)
}

const isParagraph = (str, nextLine) => {
    if (isTitle(str)) return false
    let reg = /^\s*$/gm
    let nextLineIsEmpty = typeof nextLine === 'string' && reg.test(nextLine)
    return nextLineIsEmpty
}

export default {
    name: 'PianoText',
    data() {
        return {
            pieceSize: 60,
            str: ''
        }
    },
    watch: {
        'str.length'(nVal, oVal) {
            if (nVal && !oVal) {
                // this.format()
                this.str = this.formatTextNew(this.str, this.pieceSize)
                this.copy()
            }
        }
    },
    methods: {
        format() {
            //去除代码
            //先通过.分离句子
            let list = this.str.split('.')
            //去除空格
            list = list.filter(item => item)
            let newList = []

            const space = len => {
                return ' '.repeat(len)
            }
            for (let i = 0; i < list.length; i++) {
                //每个句子
                let item = list[i]
                // if (item[0] !== ' ') {
                //     item = ' ' + item
                // }
                if (item.length > 0) {
                    //每个句子过长，然后再分离
                    if (item.length > this.pieceSize) {
                        let list = splitText(item, this.pieceSize)
                        list.forEach((p, index) => {
                            if (index === list.length - 1) {
                                newList.push(p + '.')
                            } else {
                                newList.push(p)
                            }
                            newList.push(space(p.length))
                        })
                    } else {
                        newList.push(item + '.')
                        newList.push(space(item.length))
                    }
                }
            }
            this.str = newList.join('\n')
        },
        copy() {
            copyToBoard(this.str)
            this.$Message.success('复制成功')
        },
        formatTextNew(str, pieceSize) {
            str = str + '\n   '
            let result = str.split(/\n/g)
            result = result.map((item, index) => {
                let reg = /^\s*$/gm
                if (!item || reg.test(item))
                    return { type: 'empty', content: item }
                if (isTitle(item))
                    return { type: 'title', content: item + '\n\n' }
                //判断是否是段落  不是title并且下一行为空字符串
                let nextLine = result[index + 1]
                let p = isParagraph(item, nextLine)
                if (p) {
                    // 对段落进行处理
                    if (item.length > pieceSize) {
                        //段落长度大于60，分离
                        let texts = splitText(item, pieceSize)
                        texts = texts.map((p, index) => {
                            return p + '\n' + space(p.length)
                            // if (index === list.length - 1) {
                            //     newList.push(p + '.')
                            // } else {
                            //     newList.push(p)
                            // }
                            // newList.push(space(p.length))
                        })
                        // console.log(texts)
                        return {
                            type: 'paragraph',
                            content: texts.join('\n') + '\n\n'
                        }
                    } else {
                        return { type: 'paragraph', content: item }
                    }
                } else {
                    return { type: 'other', content: item }
                }
            })
            result = result.filter(item => item.type !== 'empty')
            console.log('😝😝😝', result)
            let newStr = result.map(item => item.content).join('\n')
            return newStr
        }
    },
    mounted() {
        document.title = '文本处理——添加空行'
    }
}
</script>

<style lang="scss">
.piano-text {
    width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: 100vh;

    > nav {
        height: 40px;
    }

    > section {
        flex: 1;
        height: 100%;
        overflow-y: auto;
    }

    .el-input input,
    .el-textarea > textarea {
        font-family: monospace;
    }
}
</style>
