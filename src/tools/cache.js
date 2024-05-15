import { addData, getDataByKey, openDB } from './db'

function isIterable(obj) {
    return !!obj[Symbol.iterator]
}

//修改成LRU缓存淘汰算法 或者改成  本地数据库版本
export class GeekCache {
    //数据存在store中
    prefix = 'geek-cache-'
    version = 1

    constructor(key, version = 1) {
        this.cacheKey = this.prefix + key
        this.version = version
        this.validateVersion()
        // 对比storage中的version和传入的version是否一致，不一致就清空缓存

        const data = localStorage.getItem(this.cacheKey)
        if (data) {
            let arr = Object.entries(JSON.parse(data))
            this.map = new Map(isIterable(arr) ? arr : null)
        } else {
            this.map = new Map()
        }
    }

    validateVersion() {
        let oldVersion = localStorage.getItem(this.prefix + 'version')
        if (oldVersion != this.version) {
            console.log('clear data')
            this.clear()
        }
        localStorage.setItem(this.prefix + 'version', this.version)
    }

    set(key, value) {
        this.map.set(key, value)
        localStorage.setItem(
            this.cacheKey,
            JSON.stringify(Object.fromEntries(this.map))
        )
    }

    get(key) {
        return this.map.get(key)
    }

    has(key) {
        return this.map.has(key)
    }

    clear() {
        this.map = new Map()
        localStorage.removeItem(this.cacheKey)
    }
}

export function initApiCache(version = 1) {
    window.columnCache = new GeekCache('api', version)
}

export function setApiCache(key, value) {
    window.columnCache.set(key, value)
}

export function getApiCache(key) {
    return window.columnCache.get(key)
}

export class GeekCacheByDB {
    //数据存在store中
    db = null

    constructor(key) {
        this.key = key
        this.initDB()
    }

    async initDB() {
        this.db = await openDB('geek-app')
    }

    set(key, value) {
        if (!this.db) {
            console.warn('数据库未打开')
            return
        }
        addData(this.db, this.key, {
            id: key,
            value: value
        })
    }

    get(key) {
        if (!this.db) {
            console.warn('数据库未打开')
            return null
        }
        return getDataByKey(this.db, this.key, key)
    }

    clear() {
        this.map = null
        localStorage.removeItem(this.cacheKey)
    }
}

export function initArticleCache() {
    if (!window.articleDBCache) {
        window.articleDBCache = new GeekCacheByDB('article')
    }
}

export function addArticleCache(key, value) {
    window.articleDBCache.set(Number(key), value)
}

export function getArticleCache(key) {
    return window.articleDBCache.get(Number(key))
}
