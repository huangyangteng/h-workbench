//262, 294, 330, 349, 392, 440, 494
// 523, 587, 659, 698, 784, 880, 988
// 1047, 1175, 1319, 1397, 1568, 1760, 1967
let low = [262, 294, 330, 349, 392, 440, 494]
let middle = [523, 587, 659, 698, 784, 880, 988]
let high = [1047, 1175, 1319, 1397, 1568, 1760, 1967]
const map = {
    1: 262,
    2: 294,
    3: 330,
    4: 349,
    5: 392,
    6: 440,
    7: 494
}
// const map={
//     1:523,
//     2:587,
//     3:659,
//     4:698,
//     5:784,
//     6:880,
//     7:988
// }
export default class MusicBox {
    constructor(options) {
        // 默认值
        let defaults = {
            type: 'sine', // 音色类型  sine|square|triangle|sawtooth
            duration: 2 // 键音延长时间
        }

        this.opts = Object.assign(defaults, options)

        // 创建新的音频上下文接口
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }

    createSound(freq) {
        // 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
        let oscillator = this.audioCtx.createOscillator()
        // 创建一个GainNode,它可以控制音频的总音量
        let gainNode = this.audioCtx.createGain()
        // 把音量，音调和终节点进行关联
        oscillator.connect(gainNode)
        // this.audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
        gainNode.connect(this.audioCtx.destination)
        // 指定音调的类型  sine|square|triangle|sawtooth
        oscillator.type = this.opts.type
        // 设置当前播放声音的频率，也就是最终播放声音的调调
        oscillator.frequency.value = freq
        // 当前时间设置音量为0
        gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
        // 0.01秒后音量为1
        gainNode.gain.linearRampToValueAtTime(
            1,
            this.audioCtx.currentTime + 0.01
        )
        // 音调从当前时间开始播放
        oscillator.start(this.audioCtx.currentTime)
        // this.opts.duration秒内声音慢慢降低，是个不错的停止声音的方法
        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            this.audioCtx.currentTime + this.opts.duration
        )
        // this.opts.duration秒后完全停止声音
        oscillator.stop(this.audioCtx.currentTime + this.opts.duration)
    }

    createMusic(note) {
        this.createSound(map[note])
    }

    playMusic(musicText, speed = 2) {
        let i = 0,
            musicArr = musicText.split(' ') //[1,3,5]

        let timer = setInterval(() => {
            try {
                // let n = this.arrNotes.indexOf(musicArr[i]);  // 钢琴键位置

                // if(musicArr[i] !== '-' && musicArr[i] !== '0'){
                //     this.pressBtn(this.musicBtn[n],n);
                // }
                this.createMusic(musicArr[i])
                i++

                if (i >= musicArr.length) {
                    clearInterval(timer)
                }
            } catch (e) {
                alert('请输入正确的乐谱！')
                clearInterval(timer)
            }
        }, 1000 / speed)

        return timer
    }
}
