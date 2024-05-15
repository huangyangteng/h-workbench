<template>
    <div class="app">
        <router-view />
    </div>
</template>
<script>
import { initArticleCache } from '@/tools/cache'

export default {
    name: 'App',
    created() {
        initArticleCache()
    }
}
</script>