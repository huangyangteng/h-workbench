# vue单页开发模板搭建

> * 基于vue-cli3
> * 适用于后台管理页面
> * 常用的UI库有ElementUI和Iview，ElementUI使用Sass,iView使用Less，根据不同的UI库安装不同的预处理器

## 一、初始化项目

> 参考：https://www.jianshu.com/p/fbcad30031c2

```shell
vue create [项目名]
```

在命令行窗口中选择你需要安装的依赖即可

![image-20200203220638809](https://tva1.sinaimg.cn/large/006tNbRwgy1gbjkd8tmenj30gs06dabg.jpg)

注意：

* 根据不同的UI库安装不同的CSS预处理器，ElementUI使用Sass,Iview使用Less
* 需要安装eslint和prettier

![image-20191214150948810](https://tva1.sinaimg.cn/large/006tNbRwgy1g9w9pkltbuj31d008yn0q.jpg)

注意：初始化项目之后，删除项目中的.git目录以及.gitignore文件

## 二、 代码风格设置

> 参考：
>
> * [ 在Vue项目中使用Eslint+Prettier+Stylelint](https://segmentfault.com/a/1190000020168436)
>
> * [ prettierrc文件常见配置](https://blog.csdn.net/onlyliii/article/details/89312857)

### 1. 设置Perttierrc

根目录下新建`.prettierrc.js`

```js
//根据需要选择规则
module.exports={
    "eslintIntegration": true,
    "stylelintIntegration": true,
    "tabWidth": 4,//4空格缩进
    "singleQuote": true,//单引号
    "semi": false //使用分号
}
```

### 2. 设置vscode保存代码时自动格式化代码

根目录下新建`.vscode`文件夹，文件夹中新建`settings.json`文件

```json
{
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html",
    {
      "language": "vue",
      "autoFix": true
    },
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "typescriptreact",
      "autoFix": true
    }
  ],
  "vetur.format.defaultFormatter.scss": "prettier",
  "vetur.format.defaultFormatter.css": "prettier",
  "vetur.format.defaultFormatter.js": "prettier-eslint",
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  "stylelint.autoFix": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}

```

### 3. vscode 安装插件

* ESLint 作者 Dirk Baeumer
* Prettier 作者 Esben Petersen

### 4. 可能出现的问题

* 保存代码时，代码没有自动格式化

1. 检查所有的配置是否正常
2. 重新安装vscode的插件，重启项目
3. 如果还没有解决，google

* 使用iview或者elementui的input标签时,eslint会报错 x-invalid-end-tag

```js
//.eslintrc.js 
module.exports = {
  rules: {
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }]// 解决eslint Parsing error: x-invalid-end-tag
  },
};

```

* 执行npm run build时，eslint因为console报错

```js
//.eslintrc.js 
module.exports = {
  rules: {
    "no-console": 0
  },
};
```

## 三、为项目添加文档

> 参考：
>
> * [vuepress官网](https://vuepress.docschina.org/)
> * [vuepress默认主题配置]([https://vuepress.docschina.org/default-theme-config/#%E4%B8%BB%E9%A1%B5-homepage](https://vuepress.docschina.org/default-theme-config/#主页-homepage))

### 安装依赖及运行

使用VuePress为项目添加文档

```shell
# 安装依赖
npm i -D vuepress
# 创建一个docs目录
mkdir docs
#创建一个markdown文件
echo '# Hello VuePress' > docs/README.md
```

给package.json添加一些script脚本

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

执行   `npm run docs:dev`，启动文档

### 配置文档站点

在docs目录下创建.vuepress文件夹,然后创建config.js文件

```
.
├─ docs
│  ├─ README.md
│  └─ .vuepress
│     └─ config.js
└─ package.json
```

该文档站点的配置文件时.vuepress/config.js,结构如下

```js
module.exports = {
  title: 'Hello VuePress',//配置标题
  description: 'Just playing around'
}
```

#### 配置导航

在docs目录下新建文件如下（已有文件可以不新建）

```
.
|____components.md
|____README.md
|____controller.md
|____build.md
|____.vuepress
| |____config.js
|____tools.md
```

修改配置

```js
// .vuepress/config.js
module.exports = {
    themeConfig: {
        nav: [
          { text: '基本信息', link: '/' },
          { text: '自定义组件', link: '/components' },
          { text: '工具函数', link: '/tools' },
          { text: '复杂逻辑处理', link: '/controller/' },
          { text: '部署方案', link: '/build/' },
        ]
      }
}
```

#### 配置侧边栏

```js
module.exports = {
    title: 'XXX项目文档',
    description: 'Just playing around',
    themeConfig: {
        sidebar:'auto',//侧边栏显示所有的标题连接
      }
  }
```

配置完成效果：

![image-20200204091336933](https://tva1.sinaimg.cn/large/006tNbRwgy1gbk3n5xxs5j30z50noad2.jpg)

## 四、页面划分及路由配置

> vue-router

### 页面划分

#### 1. App.vue作为整个页面的主视图

修改App.vue的代码如下

```vue
//App.vue
<template>
    <div id="app">
        <router-view />
    </div>
</template>
```

### 2. 页面划分说明

所有的页面放在views目录下，一个模块一个文件夹，每个文件夹下有一个index.js文件，用于导出该模块的路由配置（配置之前需要删除views下原有文件）

示例目录如下：

```tree
views
├── Error
│   ├── 404.vue
│   └── index.js
├── Home
│   ├── Guide
│   │   ├── Guide.vue
│   │   ├── GuideModuleOne
│   │   │   └── One.vue
│   │   ├── GuideModuleTwo
│   │   │   └── Two.vue
│   │   ├── components
│   │   └── index.js
│   ├── Home.vue
│   ├── Util
│   │   ├── Util.vue
│   │   └── index.js
│   └── index.js
└── Login
    ├── Login.vue
    └── index.js
```

### 路由分模块配置

> 注意：每个路由需要提供name字段，使用name字段进行跳转

每个文件夹下的index.js用于导出当前模块的路由

以`Guide`模块为例

Guild的路由 ——》Home模块的路由 ——》router.js导入所有模块路由

Guide模块，导出自己模块的路由

```js
export default {
    path: '/guide',
    name: 'guide',
    component: () => import('./Guide.vue'),
    children: [
        {
            path: 'one',
            name: 'one',
            component: () => import('./GuideModuleOne/One.vue')
        }
    ]
}


```

Home模块，导入Guide模块，导出自己模块

```js
import GuideConfig from './Guide'
export default {
    path: '/',
    name:'home',
    component: () => import('./Home.vue'),
    children: [GuideConfig]
}


```

router.js导出所有模块

```js
//router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import HomeConfig from '../views/Home'
import LoginConfig from '../views/Login'
import ErrorConfig from '../views/Error'
const routes = [HomeConfig, LoginConfig, ErrorConfig]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

```

## 五、引入UI框架

注意事项：

1. 大型UI框架需要按需引入，如`iview,elementui,echarts`等
2. UI框架中，只会用到一次的组件，在会用到的文件中单独引入

### UI框架为Element-UI

#### 引入Element-UI

1. 安装依赖

```shell
npm i element-ui -S  # ^2.13.0版本
```

2. 新建文件夹`config/element-ui-config.js`

```js
//config/element-ui-config.js
import Vue from "vue";
import "element-ui/lib/theme-chalk/index.css";

//引入需要的模块
import { Message, Input, Button } from "element-ui";

//全局注册这些组件
Vue.use(Input);
Vue.use(Button);

Vue.prototype.$Message = Message;
```

3. 在main.js中引入该文件

```js
//main.js
import './config/element-ui-config'
```

### UI框架为ElementUI

## 六、API请求管理

> 数据请求使用 axios,
>
> axios中文文档：https://www.kancloud.cn/yunye/axios/234845

### 安装依赖

```shell
npm i axios -S
```

### 跨域设置

* 开发时
    * 使用devServer的proxy模块配置接口转发，配置/api前缀的url，转发到后台地址
* 部署时
    * 使用nginx做接口转发，配置/api前缀的url，转发到后台地址

1. 在config文件夹下新建 host.js，用于区分生产环境和开发环境

```js
//config/host.js
module.exports={
    dev:'http://10.4.0.125:13001/', //开发环境下服务器
}
```

2. 在根目录下新建vue.config.js,

```js
//vue.config.js
let host = require('./src/config/host')

module.exports = {
    devServer: {//只在开发时有效，打包后失效
        open: true,   //自动打开浏览器
        proxy: {    //配置接口转发    
            '/api': {
                target: host.dev,    //开发环境 后端接口地址
                changeOrigin: true,        
                autoRewrite: true,
                cookieDomainRewrite: true,
                pathRewrite: {             
                    '^/api': ''
                }
            }
        }
    },
}



```

3. axios的baseURL设置成’/api’，这样请求后台接口时就不用每次都添加/api前缀了

### API统一管理

> 将API按照功能模块进行划分，所有模块依赖http.js文件
>
>在http.js文件中进行统一的接口拦截、错误处理
>
>页面中使用API可以按需引入

![image-20200206172142741](https://tva1.sinaimg.cn/large/006tNbRwgy1gbmt06rt7qj312k0rg0sw.jpg)

在src目录下，新建api文件夹，用于统一管理所有的数据请求

在api文件夹下新建`http.js`，实例化一个axios的对象，用于统一的的请求拦截

#### 接口拦截

![image-20200206173754905](https://tva1.sinaimg.cn/large/006tNbRwgy1gbmtiyo8hhj31240ra0t6.jpg)

```js
//api/http.js
import axios from "axios";
import store from "../store";
import router from "../router";
import { Message } from "element-ui";

let instance = axios.create({
  timeout: 1000 * 30,// 超时时间
  baseURL: "/api"// 设置baseURL，区分开发环境和生产环境
});

const CancelToken = axios.CancelToken;


/**
 *
 * 保存每次发起的请求，
 * 避免重复发送请求。
 * 数组中的元素的数据结构为
 * {
 *      tag: // 用于标识请求
 *      cancelCallback: // axios中用于取消请求的回调函数
 * }
 */
class RequestList {
  constructor() {
    this.list = [];
  }

  add(request) {
    // 处理重复请求
    // 在请求发送之前执行取消操作
    this.remove(request);

    // 将一个请求添加到列表中
    new CancelToken(cancelCallback => this.list.push({
      tag: request.url + "&" + request.method,
      cancelCallback
    }));

  }

  remove(completedRequest) {
    this.list.some((pendingRequest, index) => {
      // 判断当前请求是否存在于数组中
      if (pendingRequest.tag === completedRequest.url + "&" + completedRequest.method) {

        pendingRequest.cancelCallback();// 执行取消操作
        this.list.splice(index, 1);// 删除请求
      }
    })
  }
}

// 管理权限相关
class AuthManager {
  constructor() {
    let state = localStorage.getItem('vuex')
    try {
      state = JSON.parse(state)
      if (state.user.jwt) {
        this.jwt = state.user.jwt
      } else {
        //未登录
      }
    } catch (error) {
      //未登录
    }
  }

  goLogin() {
    Message.error('登录过期！')
    router.push({ name: 'login' })
  }

  getJWT() {
    return this.jwt
  }

  updateJWT(jwt) {
    store.dispatch('user/updateJWT', jwt)
    this.jwt = jwt
  }
}


/**
 * 处理请求拦截相关操作
 */
class InterceptorManager {
  constructor(request, resData) {
    this.request = request;
    this.resData = resData;
    this.authManager = new AuthManager();
    this.requestList = new RequestList();
  }

  handleRequest() {
    this.requestList.add(this.request);
    this.request.headers.jwt = this.authManager.getJWT();

    return this.request;
  }

  handleResponse() {
    // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从请求列表中移除
    this.requestList.remove(this.request);

    let code = this.resData.code.toString();
    this.handleResponseCode(code);
    return this.resData;
  }

  handleResponseCode(code) {

    switch (code) {
      case '100000' :
        this.authManager.updateJWT(
          this.resData.jwt
        );
        break;
      case '200000' :
        this.authManager.goLogin();
        break;
      default :
        Message.error("请求失败:" + this.resData.data);
        break;
    }
  }

  handleError() {
    Message.error(`
            接口访问失败：
            URL：${this.request.config.url}，
            ErrorCode：${this.request.status}，
            StatusText：${this.request.statusText}
            `
    );

    return Promise.reject(this.request);
  }
}

// 请求拦截
instance.interceptors.request.use(
  config => {
    let interceptor = new InterceptorManager(config);
    return interceptor.handleRequest();
  },
  error => Promise.error(error)
);

// 响应拦截
instance.interceptors.response.use(
  // 请求成功
  res => {
    let interceptor = new InterceptorManager(res.config, res.data);
    return interceptor.handleResponse();
  },
  // 请求失败
  error => {
    const { response } = error;
    let interceptor = new InterceptorManager(response);
    return interceptor.handleError();
  }
);

export default instance;

```

#### 接口划分与定义

按照前端模块对接口进行划分，一个模块一个文件

以用户模块为例，新建 user.js,将用户相关的接口定义在此处

```
api
├── http.js
├── index.js
├── user.js
└── util.js
```

```js
//api/user.js
import http from './http'

const login = params => http.post('/user/login', params)
const getUserList = () => http.get('/user/list')
export const USER_API = {
  login,
  getUserList
}

```

调用定义好的api

```js

import { USER_API } from '../../api/user'

export default {
  methods: {
    async login() {
      let res = await USER_API.login(this.loginInfo)
      this.$store.dispatch('user/login', res)
    }
  }
}

```

## 七、vuex管理全局状态

使用vuex将系统中涉及到的全局状态统一管理起来

### vuex与localStorage结合

需要安装`vuex-persistedstate`，该插件会在状态变更时把store中的状态储存在localStorage中

```js
npm i vuex-persistedstate -S
```

引入：

```js
//store/index.js 仅列出核心代码

import vuexStore from 'vuex-persistedstate'

export default new Vuex.Store({
    plugins: [vuexStore()]
})

```

### 分模块管理状态

> 以用户模块为例

用户状态主要有

* info 用户信息，包括用户名、权限等
* jwt token，用于校验用户

实现的功能：

* 登录之后，储存用户信息，储存jwt
* 登出之后，清空用户信息，清空jwt

根据此目录结构新建文件

```
store
├── index.js  导出vuex的实例
├── modules   分模块管理状态
│   └── user.js
└── mutation-types.js   管理所有的mutation-types
```

### 定义状态

1. 在`mutation-types.js`文件中定义用户模块相关mutations

```js
//mutation-types.js
const USER_MU = {
  LOGIN: 'login', //登录
  LOGOUT: 'logout',//登出
  UPDATE_JWT: 'updateJWT'//更新jwt
}

export { USER_MU }

```

2. 在modules目录下新建user.js，用于管理user模块的状态键入以下内容，

```js
//user.js  主要定义对状态的操作
import { USER_MU } from '../mutation-types'

const state = {
  //定义用户相关状态
  info: {},
  jwt: ''
}

const getters = {
  //定义需要经过处理才能返回的state
}

const actions = {
  //处理异步请求及复杂逻辑
  login({ commit }, userInfo) {
    console.log(userInfo)
    commit(USER_MU.SET_USER, userInfo)
    commit(USER_MU.UPDATE_JWT, userInfo.jwt)
  },
  logout({ commit }) {
    commit(USER_MU.LOGOUT)
  },
  updateJwt({ commit }, newJwt) {
    commit(USER_MU.UPDATE_JWT, newJwt)
  }
}

const mutations = {
  //更改state中的状态
  [USER_MU.SET_USER](state, userInfo) {
    state.info = userInfo.data
  },
  [USER_MU.LOGOUT](state) {
    state.info = {}
    localStorage.removeItem('vuex')
  },
  [USER_MU.UPDATE_JWT](state, jwt) {
    state.jwt = jwt
  }
}

export default {
  //导出用户模块相关信息
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}

```

在`store/index.js`中导入`user.js`

```js
//store/index.js

import user from './modules/user'

export default new Vuex.Store({
    modules: {
        user
    },
})

```

至此，已实现状态的定义，接下来看如何更改状态

### 更改状态

> 用户提交action——》触发对应的mutation——》更改state中的状态

用户登录页面,登录之后触发action，把用户信息储存在vuex中，核心代码：

            this.$store.dispatch('user/login', res)
            this.$store.dispatch('user/updateJWT', res.jwt)

```vue
//Login.vue 详细代码
<template>
  <section class="login-container">
    <h1>登录</h1>
    <p>用户名：</p>
    <el-input v-model="loginInfo.name" />
    <p>密码：</p>
    <el-input v-model="loginInfo.pass" type="password" />
    <el-button @click="login" class="login-submit" long type="primary">
      登录
    </el-button>
  </section>
</template>
<script>
import { USER_MU } from '../../api/user'

export default {
  data() {
    return {
      loginInfo: {
        name: 'super',
        pass: '123'
      }
    }
  },
  methods: {
    async login() {
      let res = await USER_API.login(this.loginInfo)
      this.$store.dispatch('user/login', res)
      this.$router.push({ name: 'home' })
    }
  }
}
</script>


```

在登录页，点击登录后，会更新vuex中的相应状态

### 获取vuex中的状态

方式一

```js
//直接获取
this.$store.state.user
```

方式二

```js
//通过mapState获取，这种方式适用于状态需要在视图中渲染的情况
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState({
            userInfo: state => state.user.info,
            jwt: state => state.user.jwt
        })
    },
}
```

## 八、工具函数管理

### 时间操作

时间操作相关工具使用第三方库`dayjs`，大小只有2kb

[文档地址](https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/README.zh-CN.md)

### 工具函数

新建文件index.js,目录如下

```
src/tools
├── index.js
└── validate.js
```

```js
//index.js
/**
 *
 *深拷贝
 * @export
 * @param {*} obj
 * @returns
 */
export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

```

使用时在用到的地方导入该函数即可

## 九、兼容性处理

### IE9以下

在`public/index.html`,键入以下跳转代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!--[if lte IE 8]><script>window.location.href="https://support.dmeng.net/upgrade-your-browser.html?referrer="+encodeURIComponent(window.location.href);</script><![endif]-->
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>

```

### IE9

## 十、打包与部署

### 安装性能分析插件

安装依赖

```js
npm i webpack-bundle-analyzer -D
```

更改配置

```js
//vue.config.js
//vue.config.js

module.exports = {
    chainWebpack: config => {
        // ----性能分析插件
        if (process.env.NODE_ENV === 'production') {
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        }
    }
}

```

执行`npm run build`

  