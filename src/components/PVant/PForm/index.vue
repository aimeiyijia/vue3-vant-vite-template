<template>
  <form @submit="onSubmit">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { useChildren } from '@/hooks/useRelation/useChildren'
import { preventDefault } from '@/utils'
import { FORM_KEY } from '@/utils'

import type { FieldTextAlign, FieldValidateError, FieldValidationStatus } from '../PVantField/types'
interface FormProps {
  trigger: string[]
  colon: Boolean
  disabled: Boolean
  readonly: Boolean
  showError: Boolean
  labelWidth: Number | String
  labelAlign: FieldTextAlign
  inputAlign: FieldTextAlign
  scrollToError: Boolean
  validateFirst: Boolean
  submitOnEnter: Number | String
  showErrorMessage: Number | String
  errorMessageAlign: FieldTextAlign
}

const props = withDefaults(defineProps<FormProps>(), {
  trigger: () => ['change', 'blur'],
  validateFirst: () => false
})
const emits = defineEmits(['submit', 'failed'])

const { children, linkChildren } = useChildren(FORM_KEY)

linkChildren({ props })

// 在uniapp环境下获取到某一组件的所有props
function getPrivatePropsInUniApp(field) {
  if (field) return field._.props
}
// 在uniapp环境下获取到某一组件的所有expose
function getPrivateExposeInUniApp(field) {
  if (field) return field._.exposeProxy
}

const getFieldsByNames = (names?: string[]) => {
  if (names) {
    return children.filter(field => names.includes(getPrivatePropsInUniApp(field).name))
  }
  return children
}

const validateSeq = (names?: string[]) =>
  new Promise<void>((resolve, reject) => {
    const errors: FieldValidateError[] = []
    const fields = getFieldsByNames(names)

    fields
      .reduce(
        (promise, field) =>
          promise.then(() => {
            if (!errors.length) {
              return getPrivateExposeInUniApp(field)
                .validate()
                .then((error?: FieldValidateError) => {
                  if (error) {
                    errors.push(error)
                  }
                })
            }
          }),
        Promise.resolve()
      )
      .then(() => {
        if (errors.length) {
          reject(errors)
        } else {
          resolve()
        }
      })
  })

const validateAll = (names?: string[]) =>
  new Promise<void>((resolve, reject) => {
    const fields = getFieldsByNames(names)
    Promise.all(fields.map(item => getPrivateExposeInUniApp(item).validate())).then(errors => {
      errors = errors.filter(Boolean)

      if (errors.length) {
        reject(errors)
      } else {
        resolve()
      }
    })
  })

const validateField = (name: string) => {
  const matched = children.find(item => getPrivatePropsInUniApp(item).name === name)

  if (matched) {
    return new Promise<void>((resolve, reject) => {
      getPrivateExposeInUniApp(matched)
        .validate()
        .then((error?: FieldValidateError) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
    })
  }

  return Promise.reject()
}

const validate = (name?: string | string[]) => {
  if (typeof name === 'string') {
    return validateField(name)
  }
  return props.validateFirst ? validateSeq(name) : validateAll(name)
}

const resetValidation = (name?: string | string[]) => {
  if (typeof name === 'string') {
    name = [name]
  }

  const fields = getFieldsByNames(name)
  fields.forEach(item => {
    getPrivateExposeInUniApp(item).resetValidation()
  })
}

const getValidationStatus = () =>
  children.reduce<Record<string, FieldValidationStatus>>((form, field) => {
    form[field.name] = field.getValidationStatus()
    return form
  }, {})

const scrollToField = (name: string) => {
  // 这里用小程序的scroll-view 的scroll-into-view 重写
  // children.some(item => {
  //   if (item.name === name) {
  //     item.$el.scrollIntoView()
  //     return true
  //   }
  //   return false
  // })
}

const getValues = () =>
  children.reduce<Record<string, unknown>>((form, field) => {
    if (field.name !== undefined) {
      form[field.name] = field.formValue.value
    }
    return form
  }, {})

const submit = () => {
  const values = getValues()

  validate()
    .then(() => emits('submit', values))
    .catch((errors: FieldValidateError[]) => {
      emits('failed', { values, errors })

      if (props.scrollToError && errors[0].name) {
        scrollToField(errors[0].name)
      }
    })
}

const onSubmit = (event: Event) => {
  preventDefault(event)
  submit()
}
defineExpose({
  submit,
  validate,
  getValues,
  scrollToField,
  resetValidation,
  getValidationStatus
})
</script>

<style scoped></style>
