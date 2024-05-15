<template>
    <section></section>
</template>

<script>
import axios from 'axios'

export default {
    name: 'test-bdy',
    data() {
        return {}
    },
    computed: {},
    methods: {},
    created() {
        axios
            .request({
                url:
                    '/bdy-video/video/netdisk-videotran-yangquan/ee8dabc8b837f091124b78a632a5ca75_1076_2_ts/f384e01e4f9d82c90acddd6665580cfc?ts_size=4349380&app_id=250528&clienttype=0&csl=0&dp-logid=413501057087281195&fn=11-3H264PPS%E4%B8%8ESlice-Header_2020-04-0916_32%E3%80%90%E5%BE%AE%E4%BF%A1535950311%E3%80%91.mp4&from_type=0&fsid=7860747018679&idc_c=1&isplayer=1&iv=2&logid=413501057087281195&mtime=1614240366&ouk=629995778&r=74563094&size=11685919&sta_cs=6&sta_dt=video&sta_dx=11&time=1646830578&to=84&tot=c0h0g&uo=cmnet&uva=3192549404&vuk=629995778&dtime=10&etag=f384e01e4f9d82c90acddd6665580cfc&fid=1265cbcf9ec24ac4ddd69402d16f97fd-629995778&len=158108&range=2203736-2361843&region=xian&sign=BOUTHNFI-F3530edecde9cd71b79378b290804a96-%252BHhOe0fkNE9kzVmMOlh5MHUZVmc%253D&need_suf=&pmk=1400f384e01e4f9d82c90acddd6665580cfc9954d56f000000425dc4&by=my-streaming'
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(error => {
                console.log('error', error)
            })
    }
}
</script>

<style lang="scss" scoped></style>
