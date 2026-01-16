import type { FormField } from "./fields"

export interface FormPage {
  id: string
  alias: string
  order: number
  elements: FormField[]
}


