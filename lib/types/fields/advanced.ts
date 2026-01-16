import type { BaseField } from "./base"

export interface DatePickerField extends BaseField {
  type: "date"
}

export interface TimePickerField extends BaseField {
  type: "time"
}

export interface AddressField extends BaseField {
  type: "address"
  fields?: string[]
}

export interface UrlField extends BaseField {
  type: "url"
}


