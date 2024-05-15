import { NOTE_API } from '../../../../api/note'
import { OPERATE } from '../../components/video/note-list'

export const WatchNote = {
    data() {
        return {
            //  笔记 notes
            notes: []
        }
    },
    methods: {
        async fetchNotes() {
            const res = await NOTE_API.query(this.userId, this.videoId)
            this.notes = res.data.map(item => {
                let info = JSON.parse(item.info)

                return Object.assign({}, item, info)
            })
        },
        async handleNote({ operate, data }) {
            if (operate == OPERATE.ADD) {
                await NOTE_API.add({
                    value: data.value,
                    userId: this.userId,
                    connectId: this.videoId,
                    info: JSON.stringify({
                        currentTime: this.player.currentTime()
                    })
                })
                this.fetchNotes()
            } else if (operate == OPERATE.DELETEE) {
                await NOTE_API.del({
                    id: data.id
                })
                this.fetchNotes()
            } else if (operate == OPERATE.MODIFY) {
                await NOTE_API.update({
                    ...data,
                    userId: this.userId,
                    connectId: this.videoId
                })
                this.fetchNotes()
            } else if (operate == OPERATE.SET_TIME) {
                this.player.currentTime(data.currentTime)
            }
        }
    }
}
