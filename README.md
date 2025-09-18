开发日志
#9.17
昨天快速上手玩 ts 之后直接开始干项目吧！希望做完这个项目能让我巩固一下 vue 的知识，顺便学一下常用的 pinia，axios 等技术栈

##开发前的一些配置

1. eslint--代码质量检测工具

# 传统方式（需要全局安装）

npm install -g eslint
eslint --init

# 现代推荐方式（不同项目隔离）

npm init @eslint/config
生成配置文件: npm init @eslint/config

1.1vue3 环境代码校验插件

# 让所有与 prettier 规则存在冲突的 Eslint rules 失效，并使用 prettier 进行代码检查

"eslint-config-prettier"
"eslint-plugin-import"
"eslint-plugin-node"

# 运行更漂亮的 Eslint，使 prettier 规则优先级更高，Eslint 优先级低

"eslint-plugin-prettier"

# vue.js 的 Eslint 插件（查找 vue 语法错误，发现错误指令，查找违规风格指南

"eslint-plugin-vue"

# 该解析器允许使用 Eslint 校验所有 babel code

"@babel/eslint-parser"

```
安装指令

```

pnpm install -D eslint-plugin-import eslint-plugin-vue eslint-plugin-node eslint-plugin-prettier eslint-config-prettier eslint-plugin-node @babel/eslint-parser vue-eslint-parser

```
1.2修改eslint.config.ts配置文件

1.3.添加忽略文件
ignores: ["dist/", "node_modules/"],


1.4运行脚本
package.json新增两个运行脚本

```

"scripts": {
"lint": "eslint src",
"fix": "eslint src --fix",
}

```

2. prettier
ESLint：保证代码​​正确性​​（能不能运行）
Prettier：保证代码​​美观度​​（好不好看）

##### 2.1安装依赖包

```

pnpm install -D eslint-plugin-prettier prettier eslint-config-prettier

```
##### 2.2.创建.prettierrc.json并添加规则

```

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
##### 2.3.创建.prettierignore忽略文件

```

/dist/_
/html/_
.local
/node*modules/\**
\*\*/_.svg \*_/\_.sh
/public/\*

```
**现在可以通过pnpm run lint去检测语法，如果出现不规范格式,通过pnpm run fix 修改**

3. styleLint
这是css的lint工具。可格式化css代码，检查css语法错误与不合理的写法，指定css书写顺序等。

我们的项目中使用scss作为预处理器，安装以下依赖：

```

pnpm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order stylelint-config-standard-scss -D

```
##### 3.1`.stylelintrc.cjs`**配置文件**

**官网:https://stylelint.bootcss.com/**
module.exports = {
  extends: [
    'stylelint-config-standard', // 配置stylelint拓展插件
    'stylelint-config-html/vue', // 配置 vue 中 template 样式格式化
    'stylelint-config-standard-scss', // 配置stylelint scss插件
    'stylelint-config-recommended-vue/scss', // 配置 vue 中 scss 样式格式化
    'stylelint-config-recess-order', // 配置stylelint css属性书写顺序插件,
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
  /**
   * null  => 关闭该规则
   * always => 必须
   */
  rules: {
    'value-keyword-case': null, // 在 css 中使用 v-bind，不报错
    'no-descending-specificity': null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    'function-url-quotes': 'always', // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
    'no-empty-source': null, // 关闭禁止空源码
    'selector-class-pattern': null, // 关闭强制选择器类名的格式
    'property-no-unknown': null, // 禁止未知的属性(true 为不允许)
    'block-opening-brace-space-before': 'always', //大括号之前必须有一个空格或不能有空白符
    'value-no-vendor-prefix': null, // 关闭 属性值前缀 --webkit-box
    'property-no-vendor-prefix': null, // 关闭 属性前缀 -webkit-mask
    'selector-pseudo-class-no-unknown': [
      // 不允许未知的选择器
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'], // 忽略属性，修改element默认样式的时候能使用到
      },
    ],
  },
}
```

##### 3.2.stylelintignore忽略文件

```
/node_modules/*
/dist/*
/html/*
/public/*
```

##### 3.3运行脚本

配置统一的prettier来格式化我们的js和css，html代码

```
"scripts": {
	    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
    "lint:eslint": "eslint src/**/*.{ts,vue} --cache --fix",
    "lint:style": "stylelint src/**/*.{css,scss,vue} --cache --fix"
}
```

执行pnpm run format 格式化代码

4. husky
在上面我们已经集成好了我们代码校验工具，但是需要每次手动的去执行命令才会格式化我们的代码。如果有人没有格式化就提交了远程仓库中，那这个规范就没什么用。所以我们需要强制让开发人员按照代码规范来提交。
要做到这件事情，就需要利用husky在代码提交之前触发git hook(git在客户端的钩子)，然后执行`pnpm run format`来自动的格式化我们的代码。
重要：注意先把本项目添加到git仓库中，否则husky不会生效。
安装`husky`

```
pnpm install -D husky
```

执行

```
npx husky-init
```

会在根目录下生成个一个.husky目录，在这个目录下面会有一个pre-commit文件，这个文件里面的命令在我们执行commit的时候就会执行

在`.husky/pre-commit`文件添加如下命令：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm run format
```

当我们对代码进行commit操作的时候，就会执行命令，对代码进行格式化，然后再提交。

5. commitLint
6. 统一包管理工具
7. element-plus

```

```
