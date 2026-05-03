export * from "./base"
export * from "./basic"
export * from "./choice"
export * from "./file-media"
export * from "./layout-display"
export * from "./advanced"

import type {
  TextInputField,
  TextAreaField,
  NumberInputField,
  EmailInputField,
  PasswordInputField,
  PhoneInputField,
} from "./basic"
import type { RadioField, CheckboxField, SelectField } from "./choice"
import type {
  FileUploadField,
  ImageUploadField,
  SignaturePadField,
} from "./file-media"
import type {
  HeadingField,
  DescriptionField,
  HeadingDescriptionGroupField,
  DividerField,
  MediaField,
  PageBreakField,
} from "./layout-display"
import type {
  DatePickerField,
  TimePickerField,
  AddressField,
  UrlField,
} from "./advanced"

export type BasicInputField =
  | TextInputField
  | TextAreaField
  | NumberInputField
  | EmailInputField
  | PasswordInputField
  | PhoneInputField

export type ChoiceField = RadioField | CheckboxField | SelectField

export type FileAndMediaField =
  | FileUploadField
  | ImageUploadField
  | SignaturePadField

export type LayoutDisplayField =
  | HeadingField
  | DescriptionField
  | HeadingDescriptionGroupField
  | DividerField
  | MediaField
  | PageBreakField

export type AdvancedField =
  | DatePickerField
  | TimePickerField
  | AddressField
  | UrlField

export type FormField =
  | BasicInputField
  | ChoiceField
  | FileAndMediaField
  | LayoutDisplayField
  | AdvancedField


