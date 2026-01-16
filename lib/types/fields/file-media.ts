import type { BaseField } from "./base"

export interface FileUploadField extends BaseField {
  type: "file"
  accept?: string[]
  maxSizeMB?: number
}

export interface ImageUploadField extends BaseField {
  type: "image"
  accept?: string[]
  maxSizeMB?: number
}

export interface SignaturePadField extends BaseField {
  type: "signature"
}


