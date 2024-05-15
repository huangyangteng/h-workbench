import { USER_MU } from '../mutation-types'
import { MENU_LIST } from '../../views/Workbench/layout/menu-list'

const state = {
    userInfo: {
        id: '',
        userName: '',
        filter: ''
    },
    jwt: '',
    allMenu: MENU_LIST
}

const getters = {
    isLogin: state => {
        if (state.userInfo.id) {
            return true
        } else {
            return false
        }
    },
    userName: state => state.userInfo.userName,
    userId: state => state.userInfo.id,
    videoFilter: state => {
        if (typeof state.userInfo.filter === 'string') {
            return state.userInfo.filter.split(',')
        } else if (Array.isArray(state.userInfo.filter)) {
            return state.userInfo.filter
        } else {
            return []
        }
    },
    menus(state) {
        return MENU_LIST.filter(item => {
            if (item.user) {
                return item.user.includes(state.userInfo.userName)
            } else {
                return true
            }
        })
    }
}

const actions = {
    login({ commit }, userInfo) {
        commit(USER_MU.SET_USER, userInfo)
        commit(USER_MU.UPDATE_JWT, userInfo.jwt)
    },
    logout({ commit }) {
        commit(USER_MU.LOGOUT)
    },
    updateJWT({ commit }, newJWT) {
        commit(USER_MU.UPDATE_JWT, newJWT)
    }
}

const mutations = {
    [USER_MU.SET_USER](state, userInfo) {
        console.log('userInfo', userInfo)
        state.userInfo = {
            ...state.userInfo,
            ...userInfo
        }
    },
    [USER_MU.LOGOUT](state) {
        state.userInfo = {}
        state.jwt = ''
    },
    [USER_MU.UPDATE_JWT](state, jwt) {
        state.jwt = jwt
    }
}

export default {
    namespaced: true,
    state,

    actions,
    mutations,
    getters
}
