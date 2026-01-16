import type { BaseField } from "./base"

export interface RadioField extends BaseField {
  type: "radio"
  options: string[]
}

export interface CheckboxField extends BaseField {
  type: "checkbox"
  options: string[]
}

export interface SelectField extends BaseField {
  type: "select"
  options: string[]
}


