# 🚀 硅谷甄选运营平台

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.x-409EFF.svg)](https://element-plus.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🎯 基于 Vue3 + TypeScript + Vite + Element Plus 构建的现代化企业级运营管理平台

## 📋 目录

- [🚀 硅谷甄选运营平台](#-硅谷甄选运营平台)
  - [📋 目录](#-目录)
  - [✨ 项目特性](#-项目特性)
  - [🛠️ 技术栈](#️-技术栈)
  - [🚀 快速开始](#-快速开始)
    - [环境要求](#环境要求)
    - [安装依赖](#安装依赖)
    - [启动项目](#启动项目)
  - [📁 项目结构](#-项目结构)
  - [📝 开发日志](#-开发日志)
  - [⚙️ 开发环境配置](#️-开发环境配置)
    - [1. ESLint 配置](#1-eslint-配置)
    - [2. Prettier 配置](#2-prettier-配置)
    - [3. StyleLint 配置](#3-stylelint-配置)
    - [4. Husky 配置](#4-husky-配置)
    - [5. CommitLint 配置](#5-commitlint-配置)
    - [6. 统一包管理工具](#6-统一包管理工具)
  - [🔧 项目配置](#-项目配置)
    - [7. Element Plus 配置](#7-element-plus-配置)
    - [8. 路径别名配置](#8-路径别名配置)
    - [9. 环境变量配置](#9-环境变量配置)
    - [10. SVG 图标配置](#10-svg-图标配置)
    - [11. Sass 样式配置](#11-sass-样式配置)
  - [📚 使用指南](#-使用指南)
  - [🤝 贡献指南](#-贡献指南)
  - [📄 许可证](#-许可证)

---

## ✨ 项目特性

- 🎨 **现代化 UI**：基于 Element Plus 组件库，提供美观的用户界面
- 🚀 **高性能**：使用 Vite 构建工具，享受极速的开发体验
- 💪 **类型安全**：全面使用 TypeScript，提供完整的类型检查
- 🔧 **工程化**：完整的代码规范、提交规范、自动化工具链
- 📱 **响应式**：支持多端适配，提供良好的移动端体验
- 🎯 **组件化**：高度组件化的开发模式，提高代码复用性
- 🌍 **国际化**：支持多语言切换（默认中文）
- 🎪 **图标系统**：集成 SVG 图标系统，支持自定义图标

## 🛠️ 技术栈

| 技术                                          | 版本 | 描述                                |
| --------------------------------------------- | ---- | ----------------------------------- |
| [Vue.js](https://vuejs.org/)                  | 3.x  | 渐进式 JavaScript 框架              |
| [TypeScript](https://www.typescriptlang.org/) | 5.x  | JavaScript 的超集，提供静态类型检查 |
| [Vite](https://vitejs.dev/)                   | 5.x  | 下一代前端构建工具                  |
| [Element Plus](https://element-plus.org/)     | 2.x  | 基于 Vue 3 的组件库                 |
| [Vue Router](https://router.vuejs.org/)       | 4.x  | Vue.js 官方路由管理器               |
| [Pinia](https://pinia.vuejs.org/)             | 2.x  | Vue 的状态管理库                    |
| [Axios](https://axios-http.com/)              | 1.x  | 基于 Promise 的 HTTP 客户端         |
| [Sass](https://sass-lang.com/)                | 1.x  | CSS 预处理器                        |

### 开发工具

- **ESLint** - 代码质量检测
- **Prettier** - 代码格式化
- **StyleLint** - CSS/SCSS 代码规范
- **Husky** - Git 钩子管理
- **CommitLint** - 提交信息规范

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (推荐使用 pnpm 作为包管理器)

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd SV_Select

# 安装依赖
pnpm install
```

### 启动项目

```bash
# 开发环境启动
pnpm dev

# 构建生产环境
pnpm build

# 构建测试环境
pnpm build:test

# 预览构建结果
pnpm preview
```

---

## 📁 项目结构

```
SV_Select/
├── 📁 public/                 # 静态资源
├── 📁 src/                    # 源代码
│   ├── 📁 assets/            # 资源文件
│   │   ├── 📁 icons/         # SVG 图标
│   │   └── 📁 images/        # 图片资源
│   ├── 📁 components/        # 全局组件
│   │   └── 📁 SvgIcon/       # SVG 图标组件
│   ├── 📁 styles/            # 样式文件
│   │   ├── 📄 index.scss     # 主样式文件
│   │   ├── 📄 reset.scss     # 重置样式
│   │   └── 📄 variable.scss  # 样式变量
│   ├── 📄 App.vue            # 根组件
│   ├── 📄 main.ts            # 入口文件
│   └── 📄 vite-env.d.ts      # Vite 类型声明
├── 📄 .env.development        # 开发环境变量
├── 📄 .env.production         # 生产环境变量
├── 📄 .env.test              # 测试环境变量
├── 📄 vite.config.ts         # Vite 配置
├── 📄 tsconfig.json          # TypeScript 配置
├── 📄 package.json           # 项目依赖
└── 📄 README.md              # 项目说明
```

---

## 📚 使用指南

### 开发流程

1. **克隆项目并安装依赖**

   ```bash
   git clone <repository-url>
   cd SV_Select
   pnpm install
   ```

2. **启动开发服务器**

   ```bash
   pnpm dev
   ```

3. **代码开发**
   - 遵循 ESLint 和 Prettier 规范
   - 使用 TypeScript 进行类型安全开发
   - 组件开发使用 Vue 3 Composition API

4. **提交代码**
   ```bash
   git add .
   git commit -m 'feat: 添加新功能'
   git push
   ```

### 常用命令

| 命令              | 描述             |
| ----------------- | ---------------- |
| `pnpm dev`        | 启动开发服务器   |
| `pnpm build`      | 构建生产版本     |
| `pnpm build:test` | 构建测试版本     |
| `pnpm preview`    | 预览构建结果     |
| `pnpm lint`       | 检查代码质量     |
| `pnpm fix`        | 自动修复代码问题 |
| `pnpm format`     | 格式化代码       |

### 注意事项

- ✅ 必须使用 pnpm 作为包管理器
- ✅ 提交信息必须符合 CommitLint 规范
- ✅ 代码必须通过 ESLint 检查
- ✅ 样式文件必须通过 StyleLint 检查
- ✅ 使用 TypeScript 进行类型安全开发

---
