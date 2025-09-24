// 引入项目中全部都全局组件
import SvgIcon from './SvgIcon/index.vue'

// 全局对象
const allGloablComponents: any = { SvgIcon }

// 对外暴露插件对象
export default {
  // 插件安装方法install
  install(app) {
    // 注册项目全部全局组件
    Object.keys(allGloablComponents).forEach((key) => {
      // 注册组件
      app.component(key, allGloablComponents[key])
    })
  },
}
