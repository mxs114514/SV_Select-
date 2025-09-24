# 📝 硅谷甄选运营平台 - 开发日志

> **项目目标**: 通过这个项目巩固 Vue3 知识，学习 Pinia、Axios 等现代前端技术栈

---

## 📅 开发时间线

### 🗓️ 2025.09.17 - 项目初始化

**今日完成任务**：

- ✅ 项目初始化，选择 Vue3 + TypeScript + Vite 技术栈
- ✅ 完成开发环境配置（ESLint、Prettier、StyleLint）
- ✅ 集成代码规范工具（Husky、CommitLint）
- ✅ 配置 Element Plus 组件库
- ✅ 搭建基础样式系统和 SVG 图标系统

### 🗓️ 2025.09.19 - 接口与数据层搭建

**今日完成任务**：

- ✅ Mock 接口配置和数据模拟
- ✅ Axios 二次封装和拦截器配置
- ✅ API 接口统一管理架构
- ✅ 路由系统基础配置

#### 1. 📡 Mock 接口配置

**目的**: 在后端接口未完成时，通过 Mock 数据进行前端开发

**安装依赖**:

> 📚 参考文档: https://www.npmjs.com/package/vite-plugin-mock

```bash
# 安装 Mock 相关依赖
pnpm install -D vite-plugin-mock mockjs
pnpm install axios
pnpm install --save-dev @types/axios
```

**配置 vite.config.ts**:

```typescript
import { defineConfig, UserConfigExport, ConfigEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定 symbolId 格式
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled: command === 'serve', // 开发环境启用
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 路径别名配置，使用 @ 代替 src
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@use "@/styles/variable.scss" as *;',
        },
      },
    },
  }
})
```

**创建 Mock 数据**:

> 📁 **操作步骤**: 在根目录创建 `mock` 文件夹，用于存放 Mock 数据和接口

在 `mock/user.ts` 文件中创建用户相关的 Mock 接口：

```typescript
// 用户信息数据
function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token',
    },
  ]
}

export default [
  // 🔐 用户登录接口
  {
    url: '/api/user/login', // 请求地址
    method: 'post', // 请求方式
    response: ({ body }) => {
      // 获取请求体携带的用户名与密码
      const { username, password } = body
      // 调用获取用户信息函数，判断是否有此用户
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password,
      )
      // 用户不存在，返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: '账号或者密码不正确' } }
      }
      // 用户存在，返回成功信息
      const { token } = checkUser
      return { code: 200, data: { token } }
    },
  },
  // 👤 获取用户信息接口
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      // 获取请求头携带的 token
      const token = request.headers.token
      // 查看用户信息是否包含此 token 用户
      const checkUser = createUserList().find((item) => item.token === token)
      // token 无效，返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: '获取用户信息失败' } }
      }
      // token 有效，返回成功信息
      return { code: 200, data: { checkUser } }
    },
  },
]
```

#### 2. 🔄 Axios 二次封装

**目的**: 统一处理请求和响应，提高代码复用性和维护性

在项目开发中，我们需要与后端进行数据交互，使用 Axios 进行二次封装可以：

1. **📤 请求拦截器**: 处理公共业务逻辑（进度条开始、请求头携带公共参数）
2. **📥 响应拦截器**: 处理响应业务逻辑（进度条结束、简化服务器返回数据、处理 HTTP 网络错误）

**创建封装文件**:

> 📁 **文件路径**: `src/utils/request.ts`

```typescript
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础 URL
  timeout: 5000, // 请求超时时间
})

// 📤 请求拦截器
request.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  // 可以在这里添加 loading、token 等
  return config
})

// 📥 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 🚨 处理网络错误
    let msg = ''
    let status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }

    // 显示错误消息
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)

export default request
```

#### 3. 📋 API 接口统一管理

**目的**: 统一管理项目中的所有 API 接口，提高代码的可维护性

在开发项目时，接口可能很多需要统一管理。在 `src` 目录下创建 `api` 文件夹来统一管理项目的接口。

**用户相关接口**:

> 📁 **文件路径**: `src/api/user/index.ts`

```typescript
// 统一管理项目用户相关的接口
import request from '@/utils/request'

import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from './type'

// 项目用户相关的请求地址
enum API {
  LOGIN_URL = '/user/login', // 登录接口
  USERINFO_URL = '/user/info', // 获取用户信息接口
  LOGOUT_URL = '/user/logout', // 退出登录接口
}

// 🔐 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 👤 获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, userInfoReponseData>(API.USERINFO_URL)

// 🚪 退出登录接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
```

**类型定义**:

> 📁 **文件路径**: `src/api/user/type.ts`

```typescript
// 🔐 登录接口参数类型
export interface loginFormData {
  username: string
  password: string
}

// 🔑 Token 数据类型
interface dataType {
  token: string
}

// 📤 登录接口响应数据类型
export interface loginResponseData {
  code: number
  data: dataType
}

// 👤 用户信息类型
interface userInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}

// 📦 用户信息包装类型
interface user {
  checkUser: userInfo
}

// 📥 用户信息接口响应数据类型
export interface userInfoReponseData {
  code: number
  data: user
}
```

#### 4. 🛣️ 路由配置

**安装 Vue Router**:

```bash
pnpm install vue-router
```

> 💡 **说明**: Vue Router 是 Vue.js 官方的路由管理器，用于构建单页面应用程序

---

2025.09.24
真是怠惰了,前几天因为晚上沉迷蛊真人导致白天没精力学习,拖到今天才继续做项目1.登录页面搭建以及业务实现2.安装pinia并创建用户相关小仓库
src目录下新建src/store/index.ts文件
在src/store/modules/user.ts文件中创建用户相关小仓库

## ⚙️ 开发环境配置

### 1. ESLint 配置

ESLint 是代码质量检测工具，确保代码的正确性和一致性。

#### 1.1 安装 Vue3 环境代码校验插件

```bash
pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier eslint-plugin-node @babel/eslint-parser vue-eslint-parser
```

**插件说明**：

- `eslint-config-prettier` - 让 prettier 规则优先级更高
- `eslint-plugin-import` - ES6+ import/export 语法检查
- `eslint-plugin-node` - Node.js 相关规则
- `eslint-plugin-prettier` - 运行 prettier 作为 ESLint 规则
- `eslint-plugin-vue` - Vue.js 的 ESLint 插件
- `@babel/eslint-parser` - 允许 ESLint 校验所有 Babel 代码

#### 1.2 配置 eslint.config.ts

在项目根目录创建 `eslint.config.ts` 配置文件，添加忽略文件：

```typescript
ignores: ['dist/', 'node_modules/']
```

#### 1.3 添加运行脚本

在 `package.json` 中新增脚本：

```json
{
  "scripts": {
    "lint": "eslint src",
    "fix": "eslint src --fix"
  }
}
```

---

### 2. Prettier 配置

Prettier 负责代码格式化，确保代码的美观度和一致性。

> **ESLint**: 保证代码**正确性**（能不能运行）  
> **Prettier**: 保证代码**美观度**（好不好看）

#### 2.1 安装依赖包

```bash
pnpm install -D eslint-plugin-prettier prettier eslint-config-prettier
```

#### 2.2 创建 .prettierrc.json 配置文件

```json
{
  "singleQuote": true,
  "semi": false,
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "ignore",
  "endOfLine": "auto",
  "trailingComma": "all",
  "tabWidth": 2
}
```

#### 2.3 创建 .prettierignore 忽略文件

```
/dist/*
/html/*
.local
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

> 💡 **使用提示**: 现在可以通过 `pnpm run lint` 检测语法，通过 `pnpm run fix` 自动修复格式问题。

---

### 3. StyleLint 配置

StyleLint 是 CSS 的 lint 工具，可格式化 CSS 代码，检查语法错误与不合理的写法。

#### 3.1 安装依赖

```bash
pnpm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order stylelint-config-standard-scss -D
```

#### 3.2 创建 .stylelintrc.cjs 配置文件

> 📚 **官网**: https://stylelint.bootcss.com/

```javascript
module.exports = {
  extends: [
    'stylelint-config-standard', // 配置stylelint拓展插件
    'stylelint-config-html/vue', // 配置 vue 中 template 样式格式化
    'stylelint-config-standard-scss', // 配置stylelint scss插件
    'stylelint-config-recommended-vue/scss', // 配置 vue 中 scss 样式格式化
    'stylelint-config-recess-order', // 配置stylelint css属性书写顺序插件
    'stylelint-config-prettier', // 配置stylelint和prettier兼容
  ],
  overrides: [
    {
      files: ['**/*.(scss|css|vue|html)'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
  ],
  rules: {
    'value-keyword-case': null, // 在 css 中使用 v-bind，不报错
    'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    'function-url-quotes': 'always', // 要求或禁止 URL 的引号
    'no-empty-source': null, // 关闭禁止空源码
    'selector-class-pattern': null, // 关闭强制选择器类名的格式
    'property-no-unknown': null, // 禁止未知的属性
    'block-opening-brace-space-before': 'always', // 大括号之前必须有一个空格
    'value-no-vendor-prefix': null, // 关闭属性值前缀 --webkit-box
    'property-no-vendor-prefix': null, // 关闭属性前缀 -webkit-mask
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'], // 忽略属性，修改element默认样式时使用
      },
    ],
  },
}
```

#### 3.3 创建 .stylelintignore 忽略文件

```
/node_modules/*
/dist/*
/html/*
/public/*
```

#### 3.4 添加运行脚本

```json
{
  "scripts": {
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
    "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix",
    "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"
  }
}
```

> 💡 **使用提示**: 执行 `pnpm run format` 格式化代码

---

### 4. Husky 配置

Husky 用于在代码提交前自动触发 Git Hook，强制执行代码规范。

> ⚠️ **重要**: 需要先将项目添加到 Git 仓库中，否则 Husky 不会生效。

#### 4.1 安装 Husky

```bash
pnpm install -D husky
```

#### 4.2 初始化 Husky

```bash
npx husky-init
```

这会在根目录生成 `.husky` 目录，包含 `pre-commit` 文件。

#### 4.3 配置 pre-commit 钩子

在 `.husky/pre-commit` 文件中添加：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm run format
```

当执行 `git commit` 时，会自动格式化代码后再提交。

---

### 5. CommitLint 配置

CommitLint 用于统一规范 Git 提交信息格式。

#### 5.1 安装依赖

```bash
pnpm add @commitlint/config-conventional @commitlint/cli -D
```

#### 5.2 创建 commitlint.config.cjs 配置文件

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新特性、新功能
        'fix', // 修改bug
        'docs', // 文档修改
        'style', // 代码格式修改，注意不是 css 修改
        'refactor', // 代码重构
        'perf', // 优化相关，比如提升性能、体验
        'test', // 测试用例修改
        'chore', // 其他修改，比如改变构建流程、增加依赖库、工具等
        'revert', // 回滚到上一个版本
        'build', // 编译相关的修改，例如发布版本、对项目构建或依赖的改动
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
}
```

#### 5.3 添加脚本命令

```json
{
  "scripts": {
    "commitlint": "commitlint --config commitlint.config.cjs -e -V"
  }
}
```

#### 5.4 配置 Husky 钩子

```bash
npx husky add .husky/commit-msg
```

在生成的 `commit-msg` 文件中添加：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm commitlint
```

#### 5.5 提交信息格式

现在提交代码必须遵循以下格式：

```bash
git commit -m 'feat: 添加用户登录功能'
git commit -m 'fix: 修复登录页面样式问题'
git commit -m 'docs: 更新README文档'
```

> ⚠️ **注意**: 类型后面需要用英文冒号 `:` 并且冒号后面需要空一格。

---

### 6. 统一包管理工具

团队开发时需要统一包管理器工具，避免因不同工具导致的版本差异问题。

#### 6.1 创建 scripts/preinstall.js

```javascript
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `\u001b[33mThis repository must using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`,
  )
  process.exit(1)
}
```

#### 6.2 配置脚本命令

```json
{
  "scripts": {
    "preinstall": "node ./scripts/preinstall.js"
  }
}
```

> 💡 **原理**: 当使用 npm 或 yarn 安装包时会报错，因为在 install 时会触发 preinstall 钩子。

---

## 🔧 项目配置

### 7. Element Plus 配置

Element Plus 是基于 Vue 3 的组件库，提供丰富的 UI 组件。

> 📚 **官网**: https://element-plus.org/zh-CN/

#### 7.1 安装 Element Plus

```bash
pnpm install element-plus
```

#### 7.2 完全引入（推荐用于快速原型开发）

在 `main.ts` 中引入：

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

#### 7.3 安装图标组件库

```bash
pnpm install @element-plus/icons-vue
```

#### 7.4 国际化配置

配置为默认中文：

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore 忽略当前文件ts类型的检测
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
```

---

### 8. 路径别名配置

配置 `@` 别名指向 `src` 目录，简化文件引用路径。

#### 8.1 Vite 配置

在 `vite.config.ts` 中添加：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve('./src'), // 使用 @ 代替 src
    },
  },
})
```

#### 8.2 TypeScript 配置

在 `tsconfig.json` 中添加：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

### 9. 环境变量配置

配置不同环境的变量，实现环境切换的自动化。

#### 9.1 环境说明

- **开发环境 (development)**: 开发人员日常开发使用
- **测试环境 (testing)**: 测试团队进行功能测试
- **生产环境 (production)**: 正式对外提供服务

#### 9.2 创建环境变量文件

**`.env.development`** (开发环境):

```bash
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'development'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/api'
```

**`.env.production`** (生产环境):

```bash
NODE_ENV = 'production'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/api'
```

**`.env.test`** (测试环境):

```bash
NODE_ENV = 'test'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/api'
```

#### 9.3 配置构建脚本

在 `package.json` 中添加：

```json
{
  "scripts": {
    "build:test": "vue-tsc && vite build --mode test",
    "build:pro": "vue-tsc && vite build --mode production"
  }
}
```

#### 9.4 使用环境变量

```typescript
// 获取环境变量
console.log(import.meta.env)
console.log(import.meta.env.VITE_APP_TITLE)
```

---

### 10. SVG 图标配置

使用 SVG 矢量图标系统，提升页面性能和图标质量。

> 📚 **图标资源**: https://www.iconfont.cn/

#### 10.1 安装 SVG 依赖插件

```bash
pnpm install vite-plugin-svg-icons -D
```

#### 10.2 配置 Vite 插件

在 `vite.config.ts` 中配置：

```typescript
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
})
```

#### 10.3 入口文件导入

在 `main.ts` 中导入：

```typescript
import 'virtual:svg-icons-register'
```

#### 10.4 基础使用方式

```vue
<template>
  <svg>
    <use xlink:href="#icon-xxx" fill="yellow" />
  </svg>
</template>
```

#### 10.5 封装 SVG 全局组件

在 `src/components/SvgIcon/index.vue` 创建组件：

```vue
<template>
  <div>
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  // svg矢量图的名字
  name: String,
  // svg图标的颜色
  color: {
    type: String,
    default: '',
  },
  // svg宽度
  width: {
    type: String,
    default: '16px',
  },
  // svg高度
  height: {
    type: String,
    default: '16px',
  },
})
</script>
```

#### 10.6 注册全局组件

在 `src/components/index.ts` 中：

```typescript
import SvgIcon from './SvgIcon/index.vue'
import type { App, Component } from 'vue'

const components: { [name: string]: Component } = { SvgIcon }

export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    })
  },
}
```

在 `main.ts` 中注册：

```typescript
import gloablComponent from './components/index'
app.use(gloablComponent)
```

---

### 11. Sass 样式配置

集成 Sass 预处理器，支持全局样式变量和模块化样式管理。

#### 11.1 基础使用

在组件中使用 Sass：

```vue
<style scoped lang="scss">
.container {
  .title {
    color: red;
    &:hover {
      color: blue;
    }
  }
}
</style>
```

#### 11.2 全局样式配置

在 `src/styles/index.scss` 中：

```scss
@import './reset.scss';
```

在 `main.ts` 中引入：

```typescript
import '@/styles'
```

#### 11.3 全局变量配置

在 `src/styles/variable.scss` 中定义变量：

```scss
// 给项目提供的全局变量
$color: red;
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
```

#### 11.4 Vite 配置全局变量

在 `vite.config.ts` 中配置：

```typescript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: '@use "@/styles/variable.scss" as *;',
      },
    },
  },
})
```

> ⚠️ **注意**: `@use "@/styles/variable.scss" as *;` 后面的分号不要忘记。

配置完成后，全局变量可以在任何组件的样式中直接使用：

```vue
<style scoped lang="scss">
.button {
  background-color: $primary-color;
  color: $color;
}
</style>
```

---
