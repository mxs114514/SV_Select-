// 登录接口参数类型
export interface loginForm {
  username: string
  password: string
}

interface dataType {
  token: string
}

// 登录接口响应数据类型
export interface loginResponseData {
  code: number
  data: dataType
}

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
// 用户信息接口响应数据类型
interface user {
  checkUser: userInfo
}

export interface userInfoResponseData {
  code: number
  data: user
}
