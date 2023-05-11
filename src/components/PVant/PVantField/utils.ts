import { HTMLAttributes, InputHTMLAttributes } from 'vue'

import type { FieldAutosizeConfig, FieldRule, FieldType } from './types'

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (val: unknown): val is Function => typeof val === 'function'

const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch)

export function isEmptyValue(value: unknown) {
  if (Array.isArray(value)) {
    return !value.length
  }
  if (value === 0) {
    return false
  }
  return !value
}

export function runSyncRule(value: unknown, rule: FieldRule) {
  if (isEmptyValue(value)) {
    if (rule.required) {
      return false
    }
    if (rule.validateEmpty === false) {
      return true
    }
  }
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return false
  }
  return true
}

export function runRuleValidator(value: unknown, rule: FieldRule) {
  return new Promise(resolve => {
    const returnVal = rule.validator!(rule, value, (e: Error | string) => {
      // 这个函数是为了兼容从element-ui拷贝来的校验函数
      if (e) {
        resolve(e instanceof Error ? e.message : e)
      }
    })

    if (isPromise(returnVal)) {
      returnVal.then(resolve)
      return
    }

    resolve(returnVal)
  })
}

export function getRuleMessage(value: unknown, rule: FieldRule) {
  const { message } = rule

  if (isFunction(message)) {
    return message(value, rule)
  }
  return message || ''
}
