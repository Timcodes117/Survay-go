import type { BaseField } from "./base"

export interface HeadingField extends BaseField {
  type: "heading"
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export interface DescriptionField extends BaseField {
  type: "description"
  text: string
}

export interface HeadingDescriptionGroupField extends BaseField {
  type: "headingDescriptionGroup"
  heading: string
  text: string
  gapY?: number
}

export interface DividerField extends BaseField {
  type: "divider"
}

export interface MediaField extends BaseField {
  type: "media"
  url?: string
  mediaType: "image" | "video"
  imageFit?: "cover" | "contain"
  imageWidth?: "full" | "fixed"
}

export interface PageBreakField extends BaseField {
  type: "pageBreak"
}


