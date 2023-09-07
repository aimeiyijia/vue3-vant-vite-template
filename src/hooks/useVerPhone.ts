import 'vant/es/notify/style'

import { showNotify } from 'vant'

import { useRequest } from '@/http/hooks'
import { phoneReg } from '@/rules/regular'
export const useVerPhone = () => {
  const phone = ref('')
  const iphoneError = ref('')
  const smsCode = ref('')
  const disabledBtn = ref(false)
  const totalTime = ref(0)
  const verTips = ref('获取验证码')
  // 倒计时
  function countDown() {
    totalTime.value = 60
    verTips.value = totalTime.value + 's后重新发送'
    const clock = setInterval(() => {
      totalTime.value--
      verTips.value = totalTime.value + 's后重新发送'
      if (totalTime.value <= 0) {
        verTips.value = '获取验证码'
        clearInterval(clock)
        disabledBtn.value = false
      }
    }, 1000)
  }
  async function getPhoneCode(phone: string) {
    if (!disabledBtn.value) {
      disabledBtn.value = true
      if (!phoneReg.test(phone)) {
        showNotify({ type: 'warning', message: '请输入正确的手机号' })
        return
      }
      const param = {
        phone
      }
      // const res = await useRequest(new Promise(() => {}))
      const res = { code: 200 }
      if (res.code === 200) {
        showNotify({ type: 'success', message: '手机验证码发送成功' })
        countDown()
      }
    }
  }
  return {
    getPhoneCode,
    disabledBtn,
    verTips
  }
}
