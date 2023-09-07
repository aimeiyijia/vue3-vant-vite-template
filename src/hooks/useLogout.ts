import { useRoute, useRouter } from 'vue-router'

import UserInfoStore from '@/store/user'
const userInfoStore = UserInfoStore()
const router = useRouter()

export const useLogout = () => {
  // 清除所有的路由，跳转到登录页面
  function replaceToLogin() {}
  // 清除用户信息及token
  function clearUserInfo() {
    userInfoStore.clearUserInfo()
    userInfoStore.clearToken()
  }
}
