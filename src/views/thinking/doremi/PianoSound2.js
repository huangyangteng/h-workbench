import axios from 'axios'

class PianoSound2 {
    constructor() {
        this.frequencyRatioTempered = 1.059463
        this.ctx = new AudioContext()
        this.audioBuffer = null
    }

    async load() {
        const res = await axios.request({
            url: 'https://leexiao.site/file/piano.wav',
            responseType: 'arraybuffer'
        })

        this.audioBuffer = await this.ctx.decodeAudioData(res.data)
    }

    play(note = 1) {
        let frequencyRatio = 1
        let index = 8 - note
        for (let i = 0; i < index; i++) {
            frequencyRatio /= this.frequencyRatioTempered
        }
        console.log('play', frequencyRatio)
        // let frequencyRatio=
        let bufferSource = this.ctx.createBufferSource()
        bufferSource.buffer = this.audioBuffer
        bufferSource.playbackRate.value = frequencyRatio
        bufferSource.connect(this.ctx.destination)
        bufferSource.start(0)
    }
    playMusic(musicText, speed = 3) {
        let i = 0,
            musicArr = musicText.split(' ') //[1,3,5]

        let timer = setInterval(() => {
            try {
                this.play(musicArr[i])
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

export default PianoSound2
