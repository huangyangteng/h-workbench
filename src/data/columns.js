import pinyin from 'pinyin'
import { TREND_LIST } from './column-module/trend'
import { INTEREST_LIST } from './column-module/interest'
import { WEB_LIST } from './column-module/web'
import { CS_LIST } from './column-module/cs'
import { BACKEND_LIST } from './column-module/backend'
// import { PM_LIST } from './column-module/pm'
import { SKILL_LIST } from './column-module/skill'
import { VOICE_VIDEO_LIST } from './column-module/av'
import { TOOLS_LIST } from './column-module/tools'
import { GROWTH_LIST } from './column-module/growth'
import { GRADUATE_LIST } from './column-module/graduate'
const COLUMNS = WEB_LIST.concat(CS_LIST)
    .concat(SKILL_LIST)
    .concat(BACKEND_LIST)
    .concat(GRADUATE_LIST)
    .concat(VOICE_VIDEO_LIST)
    .concat(TREND_LIST)
    .concat(INTEREST_LIST)
    .concat(TOOLS_LIST)
    .concat(GROWTH_LIST)

COLUMNS.forEach(column => {
    column.title_pinyin = pinyin(column.title, {
        segment: true, // 启用分词
        group: true, // 启用词组
        style: pinyin.STYLE_NORMAL // 设置拼音风格设置为普通风格（不带声调），
    })
        .flat()
        .join('')

    column.searchType = 'column'

    column.contents.forEach(section => {
        section.subList.forEach(item => {
            item.searchType = 'article'
            item.title_pinyin = pinyin(item.title, {
                segment: true, // 启用分词
                group: true, // 启用词组
                style: pinyin.STYLE_NORMAL // 设置拼音风格设置为普通风格（不带声调），
            })
                .flat()
                .join('')
            item.columnId = column.id
        })
    })
})
// const cids=COLUMNS.map(item=>item.cid)
export default COLUMNS
