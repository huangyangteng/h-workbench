<template>
    <el-dialog
        custom-class="login-modal"
        title="提示"
        :visible.sync="dialogVisible"
        width="400px"
    >
        <div class="login-box">
            <h2>Login</h2>
            <i class="el-icon-close click-big"></i>
            <form>
                <div class="user-box">
                    <input type="text" name="" required="" />
                    <label>Username</label>
                </div>
                <div class="user-box">
                    <input type="password" name="" required="" />
                    <label>Password</label>
                </div>
                <a href="#">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                </a>
            </form>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'login-modal',
    data() {
        return {
            dialogVisible: true
        }
    },
    computed: {},
    methods: {},
    created() {}
}
</script>
<style lang="scss">
.login-modal {
    border-radius: 10px;
    box-shadow: 0 15px 25px rgb(0 0 0 / 60%);
    max-width: 88%;

    .el-dialog__header {
        display: none;
    }

    .el-dialog__body {
        padding: 0;
        border-radius: 10px;
    }
}
</style>
<style lang="scss" scoped>
.login-box {
    //position: absolute;
    //top: 50%;
    //left: 50%;
    //transform: translate(-50%, -50%);
    max-width: 400px;
    padding: 40px;
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    position: relative;
}

.login-box .el-icon-close {
    position: absolute;
    top: 20px;
    font-size: 16px;
    right: 20px;
    cursor: pointer;
}

.login-box h2 {
    margin: 0 0 30px;
    padding: 0;
    color: #fff;
    text-align: center;
}

.login-box .user-box {
    position: relative;
}

.login-box .user-box input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;
}

.login-box .user-box label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    pointer-events: none;
    transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
    top: -20px;
    left: 0;
    color: $--color-primary;
    font-size: 12px;
}

.login-box form a {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    color: $--color-primary;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    margin-top: 40px;
    letter-spacing: 4px;
}

.login-box a:hover {
    background: $--color-primary;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px $--color-primary, 0 0 25px $--color-primary,
        0 0 50px $--color-primary, 0 0 100px $--color-primary;
}

.login-box a span {
    position: absolute;
    display: block;
}

.login-box a span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, $--color-primary);
    animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
    0% {
        left: -100%;
    }
    50%,
    100% {
        left: 100%;
    }
}

.login-box a span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, $--color-primary);
    animation: btn-anim2 1s linear infinite;
    animation-delay: 0.25s;
}

@keyframes btn-anim2 {
    0% {
        top: -100%;
    }
    50%,
    100% {
        top: 100%;
    }
}

.login-box a span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, $--color-primary);
    animation: btn-anim3 1s linear infinite;
    animation-delay: 0.5s;
}

@keyframes btn-anim3 {
    0% {
        right: -100%;
    }
    50%,
    100% {
        right: 100%;
    }
}

.login-box a span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, $--color-primary);
    animation: btn-anim4 1s linear infinite;
    animation-delay: 0.75s;
}

@keyframes btn-anim4 {
    0% {
        bottom: -100%;
    }
    50%,
    100% {
        bottom: 100%;
    }
}
</style>
