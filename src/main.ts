import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局样式
import '@/styles/index.scss'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//@ts-ignore导入SVG图标注册模块
import 'virtual:svg-icons-register'
// 引入自定义插件对象:注册整个全局组件
import gloablComponent from './components/index.ts'
// 引入路由
import router from './router'

import App from './App.vue'

const app = createApp(App)
// 安装自定义插件
app.use(gloablComponent)
// 安装路由
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')
