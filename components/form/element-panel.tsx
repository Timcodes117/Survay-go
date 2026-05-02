"use client"

import type { FormField } from "@/lib/types"
import FormElementRenderer from "./element-renderer"

type ElementPanelProps = {
  element: FormField
  value?: unknown
  onChange?: (value: unknown) => void
  disabled?: boolean
}

export function ElementPanel({ element, value, onChange, disabled }: ElementPanelProps) {
  return (
    <FormElementRenderer
      element={element}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

export default ElementPanel


