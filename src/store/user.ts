import cloneDeep from 'lodash.clonedeep'
import isObject from 'lodash.isobject'

function clearObj(obj, skip: Object | string[]) {
  const skipIsArray = Array.isArray(skip)
  const skipIsObject = isObject(skip)
  Object.keys(obj).forEach(key => {
    if (skipIsArray && !skip.includes(key)) {
      delete obj[key]
    }
    if (skipIsObject && !Object.hasOwn(skip, key)) {
      delete obj[key]
    }
  })
}
export interface UserInfo {
  contactCardNo: string
  contactName: string
  contactPhone: string
  cooperativeAccountId: string
  createTime: number
  createUserCode: string
  createUserName: string
  departmentAddress: string
  departmentName: string
  fydm: string
  lastUpdate: number
  needUpdatePassword: boolean
  ssxzqh: string
  token: string
  updateTime: number
  userName: string
  userRoleCode: string
}
export interface RememberLoginInfo {
  username: string
  idCard: string
  phone: string
  remember: boolean
}
export interface UserInfoStore {
  userInfo: UserInfo
  rememberLoginInfo: RememberLoginInfo
}
// userRoleCode: 'cooperative'
export default defineStore({
  id: 'userInfo',
  persist: true,
  state: (): UserInfoStore => {
    return {
      userInfo: {
        userRoleCode: 'cooperative'
      } as UserInfo,
      rememberLoginInfo: {} as RememberLoginInfo
    }
  },
  getters: {
    token: state => {
      return state.userInfo.token ?? ''
    }
  },
  actions: {
    setUserInfo(userInfo) {
      Object.assign(this.userInfo, userInfo)
    },
    setRememberLoginInfo(rememberLoginInfo: RememberLoginInfo) {
      Object.assign(this.rememberLoginInfo, rememberLoginInfo)
    },
    clearToken() {
      this.userInfo.token = ''
    },
    clearRemeberLoginInfo() {
      clearObj(this.rememberLoginInfo, {})
    },
    clearUserInfo() {
      clearObj(this.userInfo, ['userRoleCode'])
    }
  }
})
