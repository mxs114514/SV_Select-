// 创建用户相关小仓库
import { defineStore } from 'pinia'
// 引入登录请求
import { reqLogin } from '@/api/user'
// 引入数据类型
import { loginForm } from '@/api/user/type'

let useUserStore = defineStore('User', {
  // 存储数据的地方
  state: () => {
    return {
      token: localStorage.getItem('token'), // 登录成功后获取的 token
    }
  },
  // 处理异步操作
  actions: {
    // 用户登录
    async userLogin(data: loginForm) {
      let res: any = await reqLogin(data)
      // 登录成功(200)
      if (res.code === 200) {
        // 存储 token
        this.token = res.data.token
        // 本地存储持久化存储
        localStorage.setItem('token', this.token)
        return 'ok'
      } else {
        // 登录失败(201)
        return Promise.reject(new Error(res.data.message))
      }
    },
  },
  getters: {},
})
// 导出小仓库
export default useUserStore
