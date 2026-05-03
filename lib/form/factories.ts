import type { FormField, FormPage } from "@/lib/types"

export type AddableFieldType =
  | "headingDescriptionGroup"
  | "heading"
  | "description"
  | "divider"
  | "media"
  | "pageBreak"
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "radio"
  | "checkbox"
  | "select"
  | "file"
  | "image"
  | "date"
  | "time"
  | "address"
  | "url"

const makeId = (prefix: string) =>
  `${prefix}-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`

const titleFromType: Record<AddableFieldType, string> = {
  headingDescriptionGroup: "Heading + Description",
  heading: "Heading",
  description: "Description",
  divider: "Divider",
  media: "Media",
  pageBreak: "Page Break",
  text: "Short Answer",
  textarea: "Long Answer",
  number: "Number",
  email: "Email",
  phone: "Phone",
  radio: "Radio",
  checkbox: "Checkbox",
  select: "Dropdown",
  file: "File Upload",
  image: "Image Upload",
  date: "Date",
  time: "Time",
  address: "Address",
  url: "URL",
}

export function createField(type: AddableFieldType, order: number): FormField {
  const id = makeId("el")
  const base = {
    id,
    type,
    alias: titleFromType[type],
    order,
    title: titleFromType[type],
    description: "",
    visible: true,
  } as const

  switch (type) {
    case "headingDescriptionGroup":
      return {
        ...base,
        heading: "Untitled Form",
        text: "Add a short description for this section.",
        gapY: 8,
      }
    case "heading":
      return { ...base, label: "Untitled Heading", level: 2 }
    case "description":
      return { ...base, text: "Add description here." }
    case "divider":
    case "pageBreak":
      return { ...base }
    case "media":
      return {
        ...base,
        label: "Media",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      }
    case "text":
      return { ...base, label: "Short answer", placeholder: "Type your answer", required: false }
    case "textarea":
      return { ...base, label: "Long answer", placeholder: "Type your response", required: false }
    case "number":
      return { ...base, label: "Number", placeholder: "0", min: 0, max: 100, required: false }
    case "email":
      return { ...base, label: "Email", placeholder: "name@example.com", required: false }
    case "phone":
      return { ...base, label: "Phone", placeholder: "Enter phone number", required: false }
    case "radio":
      return { ...base, label: "Choose one", options: ["Option 1"], required: false }
    case "checkbox":
      return { ...base, label: "Choose any", options: ["Option 1"], required: false }
    case "select":
      return { ...base, label: "Select option", options: ["Option 1"], required: false }
    case "file":
      return { ...base, label: "Upload file", accept: [".pdf", ".doc", ".docx"], maxSizeMB: 5 }
    case "image":
      return { ...base, label: "Upload image", accept: ["image/jpeg", "image/png"], maxSizeMB: 2 }
    case "date":
      return { ...base, label: "Date" }
    case "time":
      return { ...base, label: "Time" }
    case "address":
      return { ...base, label: "Address", placeholder: "Enter address" }
    case "url":
      return { ...base, label: "Website", placeholder: "https://example.com" }
    default:
      return { ...base, label: "Field" } as FormField
  }
}

export function createPage(order: number): FormPage {
  return {
    id: makeId("page"),
    alias: `Page ${order}`,
    order,
    elements: [],
  }
}
