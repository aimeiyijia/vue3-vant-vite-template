<template>
  <van-field
    :class="[hiddenLabel ? `hidden-label` : '']"
    :value="modelValue"
    v-bind="attrs"
    :error-message="state.validateMessage"
    @change="handleChange"
    @blur="handleBlur"
    @click-input="handleInputClick"
    @input="handleInput"
  >
    <template v-if="$slots.button" #button>
      <slot name="button"></slot>
    </template>
    <template v-if="$slots.input" #input>
      <slot name="input"></slot>
    </template>
    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>
    <!-- 插槽里的view 就算不写，uniapp也会帮你生成一个，所以为了方便调样式，还是写一个 -->
    <template v-if="$slots['left-icon']" #left-icon>
      <view class="slot__left-icon">
        <slot name="left-icon"></slot>
      </view>
    </template>
    <template v-if="$slots['right-icon']" #right-icon>
      <view class="slot__right-icon">
        <slot name="right-icon"></slot>
      </view>
    </template>
  </van-field>
</template>

<script setup lang="ts">
import { type ComponentInternalInstance, type PropType, useAttrs } from 'vue'

import { useParent } from '@/hooks/useRelation/useParent'
import { FORM_KEY, getCamelCase, toArray } from '@/utils'

import type { FormProps } from '../PForm/types'
import type {
  FieldRule,
  FieldValidateError,
  FieldValidateTrigger,
  FieldValidationStatus
} from './types'
import { getRuleMessage, isEmptyValue, runRuleValidator, runSyncRule } from './utils'

const { parent: form } = useParent(FORM_KEY)

const slots = useSlots()
const originAttrs = useAttrs()
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  hiddenLabel: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array as PropType<FieldRule[]>,
    default: () => []
  }
})
const emit = defineEmits([
  'update:modelValue',
  'change',
  'blur',
  'click-input',
  'endValidate',
  'startValidate'
])
// 封装组件时 为了解决uniapp 不支持 kebab-case（短横线）命名 所以需要转为 camelCased (驼峰式) 命名
const attrs = computed(() => {
  const newAttrs = {}
  for (const key in originAttrs) {
    newAttrs[getCamelCase(key)] = originAttrs[key]
  }
  return newAttrs
})

const getModelValue = () => String(props.modelValue ?? '')
const state = reactive({
  status: 'unvalidated' as FieldValidationStatus,
  focused: false,
  validateMessage: ''
})
watch(
  () => props.modelValue,
  () => {
    resetValidation()
    validateWithTrigger('change')
  }
)
const runRules = (rules: FieldRule[]) =>
  rules.reduce(
    (promise, rule) =>
      promise.then(() => {
        if (state.status === 'failed') {
          return
        }
        let value = props.modelValue

        if (rule.formatter) {
          value = rule.formatter(value, rule)
        }

        if (!runSyncRule(value, rule)) {
          state.status = 'failed'
          state.validateMessage = getRuleMessage(value, rule)
          return
        }
        if (rule.validator) {
          if (isEmptyValue(value) && rule.validateEmpty === false) {
            return
          }

          return runRuleValidator(value, rule).then(result => {
            if (result && typeof result === 'string') {
              state.status = 'failed'
              state.validateMessage = result
            } else if (result === false) {
              state.status = 'failed'
              state.validateMessage = getRuleMessage(value, rule)
            }
          })
        }
      }),
    Promise.resolve()
  )

const resetValidation = () => {
  state.status = 'unvalidated'
  state.validateMessage = ''
}

const endValidate = () =>
  emit('endValidate', {
    status: state.status,
    message: state.validateMessage
  })

const validate = (rules = props.rules) =>
  new Promise<FieldValidateError | void>(resolve => {
    resetValidation()

    if (rules) {
      emit('startValidate')
      runRules(rules as FieldRule[]).then(() => {
        if (state.status === 'failed') {
          resolve({
            name: originAttrs.name ? (originAttrs.name as string) : '',
            message: state.validateMessage
          })
          endValidate()
        } else {
          state.status = 'passed'
          resolve()
          endValidate()
        }
      })
    } else {
      resolve()
    }
  })

const validateWithTrigger = (trigger: FieldValidateTrigger) => {
  const originRules = props.rules as FieldRule[]
  if (form && originRules) {
    const { trigger: formTrigger } = form.props
    const defaultTrigger = toArray(formTrigger).includes(trigger)
    const rules = originRules.filter(rule => {
      if (rule.trigger) {
        return toArray(rule.trigger).includes(trigger)
      }
      return defaultTrigger
    })
    if (rules.length) {
      validate(rules)
    }
  }
}

function handleInputClick(e) {
  emit('click-input', e)
}
function handleInput(e: WechatMiniprogram.TouchEvent) {
  const value = e.detail
  emit('update:modelValue', value)
}
function handleBlur(e) {
  validateWithTrigger('blur')
  emit('blur', e)
}
function handleChange(e) {
  emit('change', e)
}

defineExpose({
  validate,
  resetValidation
})
</script>
<!-- <script lang="ts">
export default {
  name: 'CustomName',
  inheritAttrs: false,
  customOptions: {}
}
</script> -->

<style scoped lang="scss">
.hidden-label {
  :deep(.van-cell__title) {
    display: none;
  }
}
.slot__left-icon,
.slot__right-icon {
  display: flex;
  align-items: center;
}
</style>
