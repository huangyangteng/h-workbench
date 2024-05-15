<template>
    <section>
        <el-drawer
            title="菜单"
            :visible.sync="columnListDraw.show"
            :with-header="false"
            size="100%"
        >
            <section class="geek-drawer-content">
                <i @click="closeDrawer" class="el-icon-close click-big"></i>
                <ReadContent @on-selected="closeDrawer"></ReadContent>
                <!-- <section v-for="(value, key) in columnList" :key="key" v-if="false">
            <h3 style="margin:20px 0 10px 0;color:#333">
                {{ getPathName(key) }}
            </h3>
            <el-link
                v-for="column in value"
                @click="chooseColumn(column)"
                :key="column.id"
                :underline="false"
                style="margin:5px"
                >{{ column.title }}</el-link
            >
        </section> -->
            </section>
        </el-drawer>
    </section>
</template>
<script>
import COLUMN_LIST from '../../../data/columns'
import PATH_LIST from '../../../data/pathList'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { formatColumn } from '../../../tools/column-tools'
import ReadContent from '../../Home/Aside/ReadContent.vue'

export default {
    components: {
        ReadContent
    },
    data() {
        return {
            columnList: formatColumn(COLUMN_LIST, PATH_LIST)
        }
    },
    computed: {
        ...mapGetters('column', ['curColumnId']),
        ...mapState('component', ['columnListDraw']),
        ...mapGetters('lastRead', ['getLastArticleId'])
    },
    methods: {
        ...mapMutations('component', ['updateColumnListDraw']),
        getPathName(name) {
            return PATH_LIST.find(item => item.name == name).label
        },
        chooseColumn(columnInfo) {
            if (columnInfo.id == this.curColumnId) return
            let lastArticle = this.getLastArticleId(columnInfo.id)
            let defaultArticle = columnInfo.contents[0].subList[0].id
            let article = lastArticle ? lastArticle : defaultArticle
            this.$router.push({
                name: 'read',
                params: { column: columnInfo.id, article }
            })
            this.closeDrawer()
        },
        closeDrawer() {
            this.updateColumnListDraw({ show: false })
        }
    }
}
</script>

<style lang="scss" scoped>
.geek-drawer-content {
    padding: 20px 10px;
    overflow: hidden;
}
</style>
