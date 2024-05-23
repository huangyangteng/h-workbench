<template>
    <section>
        <transition leave-active-class="animate__animated animate__fadeOut">
            <article class="blog-loading" v-if="loading">
                <div
                    :style="{ width: percent * 100 + '%' }"
                    class="progress"
                ></div>
                <header
                    class="animate__animated animate__fadeIn .animate__delay-1s"
                >
                    MY PERSONAL WEBSTATION
                </header>
                <footer style="position: fixed;bottom:0">
                    <a
                        style="color:#fafafa;font-size:12px;opacity: 0.5"
                        href="https://beian.miit.gov.cn/"
                        target="_blank"
                        >蜀ICP备2021027437号-1</a
                    >
                </footer>
            </article>
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn">
            <section class="hyt-blog" v-if="!loading">
                <nav></nav>
                <header id="bannerText">
                    <BannerText v-if="false"></BannerText>
                    {{ title }}
                </header>
                <section class="blog-content">
                    <a
                        v-for="item in prodList"
                        :key="item.href"
                        :href="item.href"
                        class="blog-prod-item"
                    >
                        <h2>{{ item.title_en }}</h2>
                        <img :src="item.img" alt="" />
<!--                        <div>{{ item.title }}</div>-->
                    </a>
                </section>
                <footer style="opacity: 0.5" v-if="!isElectron">
                    <a
                        style="color:#fafafa;font-size: 12px"
                        href="https://beian.miit.gov.cn/"
                        target="_blank"
                        >蜀ICP备2021027437号-1</a
                    >
                </footer>
            </section>
        </transition>
    </section>
</template>
<script>
import BannerText from '../../components/BannerText'
import { isElectron } from '../../tools'

export default {
    components: { BannerText },
    data() {
        return {
            isElectron: false,
            title: 'WEBSTATION',
            loading: false,
            percent: 0,
            prodList: [
                {
                    title_en: 'LEARNING RESOURCES',
                    title: '学习资源汇总',
                    img: require('../../assets/imgs/clip-education-1.png'),
                    href: '#/workbench'
                },
                {
                    title_en: 'KNOWLEDGE ARCHITECTURE',
                    title: '我的知识体系',
                    img: require('../../assets/imgs/cyborg-3.png'),
                    href:
                      'https://max-h.notion.site/MY-KNOWLEDGE-SYSTEM-deb89b4a29a94670aeefc7faa0705c1a'
                },
                {
                    title_en: 'ENGLISH LEARNING',
                    title: '英语学习',
                    img: require('../../assets/imgs/gummy-macbook.png'),
                    href: '/english'
                }

            ]
        }
    },
    watch: {
        loading(truth) {
            if (truth) {
                setInterval(() => {
                    if (this.percent < 1) {
                        this.percent += 0.5
                    } else {
                        this.loading = false
                    }
                }, 1000)
            }
        }
    },
    mounted() {
        this.loading = true
        this.isElectron = isElectron()
    }
}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
 {
    opacity: 0;
}

.blog-loading {
    position: fixed;
    background: #000;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    > header {
        color: #f7f7f5;
        font-size: 2vw;
    }

    > .progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 6px;
        width: 0;
        background: #f7f7f5;
        transition: width 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955);
    }
}

.hyt-blog {
    padding: 40px;

    > header {
        text-align: center;
        font-size: 15vw;
        font-weight: 800;
        border-bottom: 2px solid $border-color;
    }

    > section {
        display: flex;
        margin-top: 120px;
    }

    > footer {
        text-align: center;
        margin-top: 60px;
        font-size: 2vw;
    }
}

.blog-prod-item:last-child {
    margin-right: 0;
}

.blog-prod-item {
    text-decoration: none;
    margin-right: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex: 1;

    > h2 {
        text-align: center;
        font-size: 4.3vw;
        color: #1f1f1f;
        line-height: 1.1;
        font-weight: 400;
    }

    > img {
        width: 100%;
    }

    > div {
        color: $font-color;
        font-size: 2vw;
        opacity: 0.8;
    }
}

@media (max-width: 750px) {
    .blog-loading {
        > header {
            font-size: 16px;
        }

        > .progress {
            height: 2px;
        }
    }
    .hyt-blog {
        padding: 20px 5px 0;

        > section {
            margin-top: 40px;
            flex-direction: column;
        }
    }
    .blog-prod-item {
        margin-right: 5px;
        margin-bottom: 60px;

        h2 {
            font-size: 24px;
        }

        div {
            font-size: 24px;
        }
    }
}
</style>