const state = {
    picturePreview: {
        show: false,
        width: '30%',
        src:
            'https://static001.geekbang.org/resource/image/46/84/4664e7f29ac02da1d451f23986ff9f84.jpg'
    },
    outlineScroll: {
        show: false,
        dis: -96
    },
    columnListDraw: {
        show: false
    }
}

const getters = {}

const actions = {}

const mutations = {
    updatePicturePreview(state, obj) {
        state.picturePreview = Object.assign(state.picturePreview, obj)
    },
    updateOutlineScroll(state, obj) {
        state.outlineScroll = Object.assign(state.outlineScroll, obj)
    },
    updateColumnListDraw(state, obj) {
        state.columnListDraw = Object.assign(state.columnListDraw, obj)
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
