import type { FieldTextAlign, FieldValidationStatus } from '../PVantField/types'

export interface FormProps {
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

export type FormExpose = {
  submit: () => void
  validate: (name?: string | string[] | undefined) => Promise<void>
  getValues: () => Record<string, unknown>
  scrollToField: (name: string, options?: boolean | ScrollIntoViewOptions | undefined) => void
  resetValidation: (name?: string | string[] | undefined) => void
  getValidationStatus: () => Record<string, FieldValidationStatus>
}
