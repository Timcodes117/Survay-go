import type { AddableFieldType } from "./factories"

export const ELEMENT_GROUPS: {
  label: string
  items: { label: string; value: AddableFieldType }[]
}[] = [
  {
    label: "Layout & Display",
    items: [
      { label: "Heading + Description", value: "headingDescriptionGroup" },
      { label: "Heading", value: "heading" },
      { label: "Description", value: "description" },
      { label: "Markdown", value: "markdown" },
      { label: "Divider", value: "divider" },
      { label: "Media", value: "media" },
      { label: "Page Break", value: "pageBreak" },
    ],
  },
  {
    label: "Basic Inputs",
    items: [
      { label: "Text", value: "text" },
      { label: "Textarea", value: "textarea" },
      { label: "Number", value: "number" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
    ],
  },
  {
    label: "Choices",
    items: [
      { label: "Radio", value: "radio" },
      { label: "Checkbox", value: "checkbox" },
      { label: "Select", value: "select" },
    ],
  },
  {
    label: "File & Media",
    items: [
      { label: "File Upload", value: "file" },
      { label: "Image Upload", value: "image" },
    ],
  },
  {
    label: "Advanced",
    items: [
      { label: "Date Picker", value: "date" },
      { label: "Time Picker", value: "time" },
      { label: "Address", value: "address" },
      { label: "URL", value: "url" },
    ],
  },
]
