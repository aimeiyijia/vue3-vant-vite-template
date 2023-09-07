<template>
  <div class="page-container login-container">
    <div class="login-desc">
      <div class="login-desc__platform">xxxxx平台</div>
      <div class="login-desc__slogan">xxxx xxxx</div>
    </div>
    <div class="login-form-container">
      <div class="login-form__form">
        <div class="form-title">欢迎登录</div>
        <van-form ref="vanFormRef" validate-trigger="onChange">
          <van-field
            v-model="loginForm.username"
            name="username"
            placeholder="请输入用户名"
            clearable
            size="large"
            :left-icon="iconUsername"
            :rules="[{ required: true, message: '请输入用户名' }]"
            @end-validate="handleVanFieldChange"
          />
          <van-field
            v-model="loginForm.idCard"
            name="idCard"
            clearable
            size="large"
            placeholder="请输入代表/委员证件号码"
            :left-icon="iconIdCard"
            :rules="[{ required: true, message: '请输入代表/委员证件号码' }]"
            @end-validate="handleVanFieldChange"
          />
          <van-field
            v-model="loginForm.phone"
            name="phone"
            clearable
            size="large"
            placeholder="请输入手机号"
            :left-icon="iconPhone"
            :rules="[{ required: true, message: '请输入手机号' }]"
            @end-validate="handleVanFieldChange"
          />
          <van-field
            v-model="loginForm.smsCode"
            name="smsCode"
            clearable
            size="large"
            placeholder="请输入短信验证码"
            :left-icon="iconSmsCode"
            :rules="[{ required: true, message: '请输入短信验证码' }]"
            @end-validate="handleVanFieldChange"
          >
            <template #button>
              <van-button
                size="mini"
                type="primary"
                :disabled="verPhone.disabledBtn.value"
                @click="handleGetSmsCode"
              >
                {{ verPhone.verTips.value }}
              </van-button>
            </template>
          </van-field>
          <van-field name="remember" size="large">
            <template #input>
              <van-checkbox v-model="loginForm.remember">记住用户</van-checkbox>
            </template>
          </van-field>
        </van-form>
      </div>
      <div class="login-form__opera">
        <van-button type="primary" block :disabled="submitBtnDisabled" @click="handleSubmit">
          登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import omit from 'lodash.omit'
import { useRouter } from 'vue-router'

import { useVerPhone } from '@/hooks/useVerPhone'
import useUserStore from '@/store/user'
const Router = useRouter()
const userInfo = useUserStore()
const verPhone = useVerPhone()
function getImageUrl(name: string) {
  return new URL(`/src/assets/images/userInfo/${name}`, import.meta.url).href
}
const iconUsername = getImageUrl(`icon_username.png`)
const iconIdCard = getImageUrl(`icon_idCard.png`)
const iconPhone = getImageUrl(`icon_phone.png`)
const iconSmsCode = getImageUrl(`icon_smsCode.png`)

const vanFormRef = ref<any>(null)
const submitBtnDisabled = ref(true)
const loginForm = reactive({
  username: '',
  idCard: '',
  phone: '',
  smsCode: '',
  remember: true
})

function handleVanFieldChange() {
  const validationStatus = vanFormRef.value!.getValidationStatus()

  const validationFormStatus = omit(validationStatus, ['remember'])
  const target = Object.values(validationFormStatus).find(
    o => o === 'unvalidated' || o === 'failed'
  )
  submitBtnDisabled.value = true
  if (!target) {
    submitBtnDisabled.value = false
  }
}

onMounted(() => {
  setRememberLoginInfo()
})

function setRememberLoginInfo() {
  const { rememberLoginInfo } = userInfo
  const { remember } = rememberLoginInfo
  console.log(rememberLoginInfo, 'rememberLoginInfo')
  if (remember) {
    Object.assign(loginForm, rememberLoginInfo)
  } else {
    loginForm.remember = false
  }
}

function handleGetSmsCode() {
  verPhone.getPhoneCode(loginForm.phone)
}

const handleSubmit = () => {
  vanFormRef.value!.validate().then(validate => {
    if (!validate) {
      console.log('校验通过，发起接口请求')
      // 登录成功之后调用
      goHome()
      if (loginForm.remember) {
        const rememberLoginInfo = omit(loginForm, ['smsCode'])
        userInfo.setRememberLoginInfo(rememberLoginInfo)
      } else {
        userInfo.clearRemeberLoginInfo()
      }
    }
  })
}

function goHome() {
  Router.push('/home')
}
</script>

<style scoped lang="scss">
.login-container {
  padding: 0 12px;
  background-image: url('@/assets/images/userInfo/login-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  color: #fff;
  .login-desc {
    padding: 28px 0 28px 6px;
    .login-desc__platform {
      font-weight: bold;
      font-size: 26px;
    }
    .login-desc__slogan {
      margin-top: 4px;
      font-size: 14px;
    }
  }
  .login-form-container {
    .login-form__form {
      padding: 0 0 12px;
      border-radius: 12px;
      background-color: #fff;
      box-shadow: 0 0 5px #c6c8df61;
      .form-title {
        padding: 24px 18px;
        border-radius: 12px;
        background: linear-gradient(180deg, #e7efff 7%, #fff 95%);
        font-weight: 700;
        font-size: 24px;
        color: #222;
      }
      .van-field {
        align-items: center;
        :deep(.van-field__left-icon) {
          margin-right: 8px;
        }
        :deep(.van-icon__image) {
          width: 16px;
          height: 16px;
        }
      }
    }
    .login-form__opera {
      margin-top: 12px;
    }
  }
}
</style>
