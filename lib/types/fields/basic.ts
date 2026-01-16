import type { BaseField } from "./base"

export interface TextInputField extends BaseField {
  type: "text"
}

export interface TextAreaField extends BaseField {
  type: "textarea"
}

export interface NumberInputField extends BaseField {
  type: "number"
  min?: number
  max?: number
  step?: number
}

export interface EmailInputField extends BaseField {
  type: "email"
}

export interface PasswordInputField extends BaseField {
  type: "password"
}

export interface PhoneInputField extends BaseField {
  type: "phone"
}
