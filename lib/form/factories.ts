import type { FormField, FormPage } from "@/lib/types"

export type AddableFieldType =
  | "headingDescriptionGroup"
  | "heading"
  | "description"
  | "markdown"
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
  markdown: "Markdown",
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
  const common = {
    id,
    alias: titleFromType[type],
    order,
    title: titleFromType[type],
    description: "",
    visible: true as const,
  }

  switch (type) {
    case "headingDescriptionGroup":
      return {
        ...common,
        type: "headingDescriptionGroup",
        heading: "Untitled Form",
        text: "Add a short description for this section.",
        gapY: 8,
      }
    case "heading":
      return { ...common, type: "heading", label: "Untitled Heading", level: 2 }
    case "description":
      return { ...common, type: "description", text: "Add description here." }
    case "markdown":
      return {
        ...common,
        type: "markdown",
        content: "## Section title\n\nUse **Markdown** to format instructions, links, and lists.",
      }
    case "divider":
      return { ...common, type: "divider" }
    case "pageBreak":
      return { ...common, type: "pageBreak" }
    case "media":
      return {
        ...common,
        type: "media",
        label: "Media",
        mediaType: "image",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        imageFit: "cover",
        imageWidth: "full",
      }
    case "text":
      return { ...common, type: "text", label: "Short answer", placeholder: "Type your answer", required: false }
    case "textarea":
      return { ...common, type: "textarea", label: "Long answer", placeholder: "Type your response", required: false }
    case "number":
      return { ...common, type: "number", label: "Number", placeholder: "0", min: 0, max: 100, required: false }
    case "email":
      return { ...common, type: "email", label: "Email", placeholder: "name@example.com", required: false }
    case "phone":
      return { ...common, type: "phone", label: "Phone", placeholder: "Enter phone number", required: false }
    case "radio":
      return { ...common, type: "radio", label: "Choose one", options: ["Option 1"], required: false }
    case "checkbox":
      return { ...common, type: "checkbox", label: "Choose any", options: ["Option 1"], required: false }
    case "select":
      return { ...common, type: "select", label: "Select option", options: ["Option 1"], required: false }
    case "file":
      return { ...common, type: "file", label: "Upload file", accept: [".pdf", ".doc", ".docx"], maxSizeMB: 5 }
    case "image":
      return { ...common, type: "image", label: "Upload image", accept: ["image/jpeg", "image/png"], maxSizeMB: 2 }
    case "date":
      return { ...common, type: "date", label: "Date" }
    case "time":
      return { ...common, type: "time", label: "Time" }
    case "address":
      return { ...common, type: "address", label: "Address", placeholder: "Enter address" }
    case "url":
      return { ...common, type: "url", label: "Website", placeholder: "https://example.com" }
    default:
      return { ...common, type: "text", label: "Field", placeholder: "Type your answer", required: false }
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
