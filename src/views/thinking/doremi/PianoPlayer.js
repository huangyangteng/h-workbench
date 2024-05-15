import axios from 'axios'

class PianoPlayer {
    constructor() {
        this.frequencyRatioTempered = 1.059463
        this.ctx = new AudioContext()
        this.audioBuffers = []
    }

    async load() {
        let notes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si']
        let notePromises = notes.map(note => {
            return axios.request({
                url: `music-notes/${note}.mp3`,
                responseType: 'arraybuffer'
            })
        })
        const results = await Promise.all(notePromises)
        for (let i = 0; i < results.length; i++) {
            this.audioBuffers.push(
                await this.ctx.decodeAudioData(results[i].data)
            )
        }
    }

    play(note = 1) {
        let bufferSource = this.ctx.createBufferSource()
        bufferSource.buffer = this.audioBuffers[note - 1]
        bufferSource.connect(this.ctx.destination)
        bufferSource.start(0)
    }

    playMusic(musicText, speed = 2) {
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

export default PianoPlayer
