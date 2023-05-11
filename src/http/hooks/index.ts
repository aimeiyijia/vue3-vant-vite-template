import to from 'await-to-js'
import { showDialog, showLoadingToast } from 'vant'

showLoadingToast({
  message: '加载中...',
  forbidClick: true
})
interface IProcessResponse {
  code: number
  msg: string
  data: any
}
interface IParams {
  loadingText?: string
}
export async function useRequest(fn: Promise<any>, params?: IParams) {
  const { loadingText = '' } = params || {}
  // 请求是否成功的状态指示
  let status = false
  const loadingToast = showLoadingToast({
    message: '加载中',
    forbidClick: true
  })
  const [err, response] = await to<IProcessResponse>(fn)
  loadingToast.close()

  if (err || !response) {
    console.log(err, '接口请求出错')
    status = false
    return {
      status,
      code: '',
      data: null,
      msg: ''
    }
  }

  const { code, msg, data } = response
  if (code === 200) {
    status = true
    console.log('请求成功且获取到了数据')
  } else {
    status = false
    showDialog({
      title: '提示',
      message: msg
    }).then(() => {})
  }
  return {
    status,
    code,
    data,
    msg: ''
  }
}
