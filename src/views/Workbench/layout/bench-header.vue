<template>
    <section class="bench-header">
        <div class="left">
            <menu-icon></menu-icon>
            <a href="https://leexiao.site/"
                ><img src="/g/logo.png" class="logo" alt="logo"
            /></a>
        </div>
        <div class="center">
            <el-input
                v-model="searchKey"
                prefix-icon="el-icon-search"
                placeholder="Search Something..."
                @focus="onFocus"
            ></el-input>
        </div>
        <div class="right">
            <div class="login">
                <!--              已登录-->
                <div class="user-info" v-if="isLogin">
                    <el-dropdown @command="handleUser" trigger="click">
                        <span class="el-dropdown-link">
                            <i
                                style="color:#fff"
                                class="el-icon-user-solid"
                            ></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                v-for="item in userOperation"
                                :key="item.command"
                                :command="item.command"
                            >
                                {{ item.label }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <!--              未登录-->
                <el-popover
                    v-else
                    style="box-shadow: 0 6px 24px rgba(0 ,0, 0 , 0.2)"
                    placement="bottom"
                    width="200"
                    v-model="visible"
                    trigger="click"
                >
                    <el-form
                        :inline="true"
                        :model="userInfo"
                        :rules="rules"
                        class="demo-form-inline"
                        ref="loginForm"
                        @submit.native.prevent
                    >
                        <el-form-item
                            label="用户名:"
                            style="margin-bottom: 10px"
                            prop="user"
                        >
                            <el-input
                                ref="userInput"
                                v-model="userInfo.user"
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            prop="password"
                            label="密码:"
                            style="margin-bottom: 10px"
                        >
                            <el-input
                                :show-password="true"
                                v-model="userInfo.password"
                                type="password"
                                @keydown.native="onKeyDown"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                size="mini"
                                type="primary"
                                plain
                                @click="onSubmit('login')"
                                >登录
                            </el-button>
                            <el-button
                                size="mini"
                                type="primary"
                                plain
                                @click="onSubmit('register')"
                                >注册
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <span slot="reference" class="login-reference">
                        <i class="el-icon-user-solid"></i>
                    </span>
                </el-popover>
            </div>
        </div>
    </section>
</template>

<script>
import { USER_API } from '../../../api/user'
import { mapGetters, mapMutations } from 'vuex'
import { USER_MU } from '../../../store/mutation-types'
import MenuIcon from './menu-icon'

export default {
    name: 'bench-header',
    components: { MenuIcon },
    data() {
        return {
            searchKey: '',
            visible: false,
            userInfo: {
                user: '',
                password: ''
            },
            rules: {
                user: [{ required: true, message: '请输入用户名' }],
                password: [{ required: true, message: '请输入密码' }]
            },
            userOperation: [{ command: 'logout', label: '退出登录' }]
        }
    },
    computed: {
        ...mapGetters('user', ['isLogin', 'userName'])
    },
    watch: {
        visible(show) {
            if (show) {
                this.$nextTick(() => {
                    this.$refs.userInput.focus()
                })
            }
        }
    },
    methods: {
        ...mapMutations('user', [USER_MU.SET_USER]),
        handleUser(command) {
            console.log(command)
            if (command === 'logout') {
                this.$store.dispatch('user/logout')
                this.$Message.success('退出登录成功!')
            }
        },
        onKeyDown(e) {
            if (e.keyCode === 13) {
                this.onSubmit()
            }
        },
        onFocus() {
            this.$emit('focus')
        },
        resetForm() {
            this.userInfo = {
                user: '',
                password: ''
            }
            this.$refs.loginForm.resetFields()
            this.visible = false
        },
        onSubmit(type = 'login') {
            this.$refs.loginForm.validate(async valid => {
                if (!valid) {
                    return false
                }
                if (type === 'register') {
                    //注册
                    const res = await USER_API.register({
                        username: this.userInfo.user,
                        password: this.userInfo.password
                    })
                    if (res.code === 2000) {
                        this.$Message.success('注册成功')
                    } else {
                        this.$Message.error(res.data)
                    }
                } else if (type === 'login') {
                    //登录
                    const res = await USER_API.login({
                        username: this.userInfo.user,
                        password: this.userInfo.password
                    })
                    if (res.code === 2000) {
                        this.$Message.success('登录成功')
                        const { id, username, filter } = res.data
                        this[USER_MU.SET_USER]({
                            id,
                            userName: username,
                            filter: filter
                        })
                        this.resetForm()
                    } else {
                        this.$Message.error(res.data)
                    }
                }
            })
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
.bench-header {
    display: flex;
    justify-content: space-between;

    .center {
        width: 600px;
        margin: 0 auto;
    }

    .left,
    .right {
        flex: 1;
        position: relative;
    }

    .left {
        min-width: 50px;

        > a {
            height: 100%;
            display: flex;
            align-items: center;
        }

        .logo {
            margin-left: 1em;
            width: 1.5em;
        }
    }

    .right {
        text-align: right;
    }

    .login {
        padding-right: 5%;
        font-size: 12px;
        min-width: 30px;
    }

    .login-reference {
        cursor: pointer;

        .line {
            argin: 0px 2px;
            font-size: 12px;
            transform: scale(0.8);
            display: inline-block;
        }
    }
}
</style>
