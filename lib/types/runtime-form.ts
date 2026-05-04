import type { FormField, FormPage } from "./index"

export type ValidationSeverity = "error" | "warning"

export interface ValidationIssue {
  code: string
  fieldPath: string
  message: string
  severity: ValidationSeverity
}

export interface FormValidationResult {
  ok: boolean
  value: FormPage[]
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

const FIELD_TYPES = new Set([
  "text",
  "textarea",
  "number",
  "email",
  "password",
  "phone",
  "radio",
  "checkbox",
  "select",
  "file",
  "image",
  "signature",
  "heading",
  "description",
  "headingDescriptionGroup",
  "divider",
  "media",
  "pageBreak",
  "date",
  "time",
  "address",
  "url",
] as const)

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

const toStringWithDefault = (value: unknown, fallback: string): string => {
  if (typeof value === "string" && value.trim().length > 0) return value
  return fallback
}

const toBooleanWithDefault = (value: unknown, fallback: boolean): boolean => {
  if (typeof value === "boolean") return value
  return fallback
}

const toNumberOrUndefined = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value
  return undefined
}

const toStringArrayOrUndefined = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined
  return value.filter((entry): entry is string => typeof entry === "string")
}

const normalizeField = (
  rawField: unknown,
  pageIndex: number,
  fieldIndex: number,
  warnings: ValidationIssue[],
  errors: ValidationIssue[]
): FormField => {
  const fieldPath = `pages[${pageIndex}].elements[${fieldIndex}]`
  const fallbackId = `unknown-${pageIndex + 1}-${fieldIndex + 1}`
  const fallbackAlias = `Field ${fieldIndex + 1}`
  const fallbackTitle = `Field ${fieldIndex + 1}`

  const fieldRecord = toRecord(rawField)
  if (!fieldRecord) {
    errors.push({
      code: "field.invalid_shape",
      fieldPath,
      message: "Field must be an object.",
      severity: "error",
    })
    return {
      id: fallbackId,
      type: "description",
      alias: fallbackAlias,
      order: fieldIndex + 1,
      title: fallbackTitle,
      description: "Recovered from invalid field shape.",
      text: "Unsupported field payload.",
      visible: true,
    }
  }

  const rawType = fieldRecord.type
  const type = typeof rawType === "string" ? rawType : "description"
  const base = {
    id: toStringWithDefault(fieldRecord.id, fallbackId),
    type,
    alias: toStringWithDefault(fieldRecord.alias, fallbackAlias),
    order: toNumberOrUndefined(fieldRecord.order) ?? fieldIndex + 1,
    title: toStringWithDefault(fieldRecord.title, fallbackTitle),
    description: toStringWithDefault(fieldRecord.description, ""),
    label:
      typeof fieldRecord.label === "string" && fieldRecord.label.trim().length > 0
        ? fieldRecord.label
        : undefined,
    placeholder:
      typeof fieldRecord.placeholder === "string" && fieldRecord.placeholder.trim().length > 0
        ? fieldRecord.placeholder
        : undefined,
    required: toBooleanWithDefault(fieldRecord.required, false),
    visible: toBooleanWithDefault(fieldRecord.visible, true),
    helpText:
      typeof fieldRecord.helpText === "string" && fieldRecord.helpText.trim().length > 0
        ? fieldRecord.helpText
        : undefined,
  }

  if (!FIELD_TYPES.has(type as (typeof FIELD_TYPES extends Set<infer T> ? T : never))) {
    warnings.push({
      code: "field.unknown_type",
      fieldPath: `${fieldPath}.type`,
      message: `Unknown field type "${String(rawType)}". Falling back to "description".`,
      severity: "warning",
    })
    return {
      ...base,
      type: "description",
      text: `Unsupported field type: ${String(rawType)}`,
    }
  }

  switch (type) {
    case "number":
      return {
        ...base,
        type,
        min: toNumberOrUndefined(fieldRecord.min),
        max: toNumberOrUndefined(fieldRecord.max),
        step: toNumberOrUndefined(fieldRecord.step),
      }
    case "radio":
    case "checkbox":
    case "select":
      return {
        ...base,
        type,
        options: toStringArrayOrUndefined(fieldRecord.options) ?? [],
      }
    case "file":
    case "image":
      return {
        ...base,
        type,
        accept: toStringArrayOrUndefined(fieldRecord.accept),
        maxSizeMB: toNumberOrUndefined(fieldRecord.maxSizeMB),
      }
    case "signature":
      return { ...base, type }
    case "heading": {
      const level = toNumberOrUndefined(fieldRecord.level)
      const normalizedLevel =
        level && level >= 1 && level <= 6 ? (level as 1 | 2 | 3 | 4 | 5 | 6) : 2
      return { ...base, type, level: normalizedLevel }
    }
    case "description":
      return {
        ...base,
        type,
        text: toStringWithDefault(fieldRecord.text, ""),
      }
    case "headingDescriptionGroup":
      return {
        ...base,
        type,
        heading: toStringWithDefault(fieldRecord.heading, base.label ?? base.title),
        text: toStringWithDefault(fieldRecord.text, ""),
        gapY: toNumberOrUndefined(fieldRecord.gapY) ?? 8,
      }
    case "divider":
    case "pageBreak":
      return { ...base, type }
    case "media": {
      const mediaType = fieldRecord.mediaType === "video" ? "video" : "image"
      const imageFit = fieldRecord.imageFit === "contain" ? "contain" : "cover"
      const imageWidth = fieldRecord.imageWidth === "fixed" ? "fixed" : "full"
      return {
        ...base,
        type,
        mediaType,
        url: typeof fieldRecord.url === "string" ? fieldRecord.url : undefined,
        imageFit,
        imageWidth,
      }
    }
    case "address":
      return {
        ...base,
        type,
        fields: toStringArrayOrUndefined(fieldRecord.fields),
      }
    case "text":
    case "textarea":
    case "email":
    case "password":
    case "phone":
    case "date":
    case "time":
    case "url":
      return { ...base, type }
    default:
      return {
        ...base,
        type: "description",
        text: `Unsupported field type: ${type}`,
      }
  }
}

export const validateAndNormalizeForm = (payload: unknown): FormValidationResult => {
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []

  if (!Array.isArray(payload)) {
    errors.push({
      code: "form.invalid_shape",
      fieldPath: "pages",
      message: "Form pages payload must be an array.",
      severity: "error",
    })
    return { ok: false, value: [], errors, warnings }
  }

  const normalizedPages: FormPage[] = payload.map((rawPage, pageIndex) => {
    const pagePath = `pages[${pageIndex}]`
    const pageRecord = toRecord(rawPage)
    if (!pageRecord) {
      errors.push({
        code: "page.invalid_shape",
        fieldPath: pagePath,
        message: "Page must be an object.",
        severity: "error",
      })
      return {
        id: `page-${pageIndex + 1}`,
        alias: `Page ${pageIndex + 1}`,
        order: pageIndex + 1,
        elements: [],
      }
    }

    const rawElements = Array.isArray(pageRecord.elements) ? pageRecord.elements : []
    if (!Array.isArray(pageRecord.elements)) {
      warnings.push({
        code: "page.elements_missing",
        fieldPath: `${pagePath}.elements`,
        message: "Page elements missing or invalid; defaulted to empty array.",
        severity: "warning",
      })
    }

    return {
      id: toStringWithDefault(pageRecord.id, `page-${pageIndex + 1}`),
      alias: toStringWithDefault(pageRecord.alias, `Page ${pageIndex + 1}`),
      order: toNumberOrUndefined(pageRecord.order) ?? pageIndex + 1,
      elements: rawElements.map((rawField, fieldIndex) =>
        normalizeField(rawField, pageIndex, fieldIndex, warnings, errors)
      ),
    }
  })

  return {
    ok: errors.length === 0,
    value: normalizedPages,
    errors,
    warnings,
  }
}
