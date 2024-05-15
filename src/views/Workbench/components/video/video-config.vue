<template>
    <Poptip
        class="poptip-reset "
        trigger="hover"
        content="content"
        placement="top"
    >
        <Icon type="ios-settings" />
        <div slot="content" class="video-config-warpper">
            <li>
                <span @click="setPlayNext(!playNext)" style="margin-right:8px"
                    >自动播放下一个</span
                >
                <i-Switch :value="playNext" @on-change="setPlayNext"></i-Switch>
            </li>
        </div>
    </Poptip>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { WATCH_MU } from '../../../../store/mutation-types'

export default {
    name: 'video-config',
    data() {
        return {}
    },
    computed: {
        ...mapState('watch', {
            playNext: state => state.config.playNext
        })
    },
    methods: {
        ...mapMutations('watch', [WATCH_MU.SET_CONFIG]),
        setPlayNext(val) {
            this.$store.commit('watch/setConfig', { playNext: val })
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.video-config-warpper {
    li {
        list-style: none;
        cursor: pointer;
        color: $font-color-second;
        font-size: 12px;
        padding: 10px 6px;
    }

    // li:hover {
    //     color: $--color-primary;
    // }
}
</style>
