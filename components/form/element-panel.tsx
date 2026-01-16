"use client"

import * as React from "react"
import type { FormField } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

type ElementPanelProps = {
  element: FormField
  value?: unknown
  onChange?: (value: unknown) => void
  disabled?: boolean
}

export function ElementPanel({ element, value, onChange, disabled }: ElementPanelProps) {
  const commonLabel = element.label ?? element.alias

  switch (element.type) {
    // Basic inputs
    case "text":
    case "email":
    case "password":
    case "tel":
    case "url":
    case "number": {
      return (
        <div className="flex flex-col gap-2">
          {commonLabel && <Label htmlFor={element.id}>{commonLabel}</Label>}
          <Input
            id={element.id}
            type={element.type === "text" ? "text" : element.type}
            placeholder={element.placeholder}
            disabled={disabled}
            value={(value as string | number | undefined) ?? ""}
            onChange={(e) => onChange?.(element.type === "number" ? Number(e.target.value) : e.target.value)}
          />
        </div>
      )
    }

    // Choice fields
    case "select": {
      const opts = (element as any).options as string[]
      return (
        <div className="flex flex-col gap-2">
          {commonLabel && <Label htmlFor={element.id}>{commonLabel}</Label>}
          <Select value={(value as string | undefined) ?? undefined} onValueChange={(v) => onChange?.(v)}>
            <SelectTrigger id={element.id} className="h-9">
              <SelectValue placeholder={element.placeholder ?? "Select"} />
            </SelectTrigger>
            <SelectContent>
              {opts?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }
    case "radio": {
      const opts = (element as any).options as string[]
      return (
        <div className="flex flex-col gap-2">
          {commonLabel && <Label>{commonLabel}</Label>}
          <div className="flex flex-col gap-2">
            {opts?.map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={element.id}
                  value={opt}
                  disabled={disabled}
                  checked={value === opt}
                  onChange={() => onChange?.(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }
    case "checkbox": {
      const opts = (element as any).options as string[]
      const current = new Set<string>(Array.isArray(value) ? (value as string[]) : [])
      const toggle = (opt: string) => {
        const next = new Set(current)
        next.has(opt) ? next.delete(opt) : next.add(opt)
        onChange?.(Array.from(next))
      }
      return (
        <div className="flex flex-col gap-2">
          {commonLabel && <Label>{commonLabel}</Label>}
          <div className="flex flex-col gap-2">
            {opts?.map((opt) => (
              <label key={opt} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={current.has(opt)}
                  onChange={() => toggle(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }

    // Layout & display
    case "heading": {
      const level = (element as any).level ?? 2
      const Tag = ("h" + level) as keyof JSX.IntrinsicElements
      return <Tag className="font-semibold text-lg">{element.label ?? element.alias}</Tag>
    }
    case "description": {
      const text = (element as any).text ?? element.helpText ?? ""
      return <p className="text-sm text-muted-foreground whitespace-pre-wrap">{text}</p>
    }
    case "divider": {
      return <Separator />
    }
    case "media": {
      const media = element as any
      if (media.mediaType === "image") {
        return (
          <div className="flex flex-col gap-2">
            {commonLabel && <Label>{commonLabel}</Label>}
            {media.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.url} alt={commonLabel ?? "Image"} className="max-w-full rounded" />
            ) : (
              <div className="text-xs text-muted-foreground">No image</div>
            )}
          </div>
        )
      }
      return <div className="text-xs text-muted-foreground">Unsupported media</div>
    }
    case "pageBreak": {
      return <div className="text-xs text-muted-foreground">Page Break</div>
    }

    // File & media inputs (simplified placeholders)
    case "file":
    case "image":
    case "signature": {
      return (
        <div className="flex flex-col gap-2">
          {commonLabel && <Label htmlFor={element.id}>{commonLabel}</Label>}
          <input id={element.id} type="file" disabled={disabled} onChange={(e) => onChange?.(e.target.files)} />
        </div>
      )
    }

    // Advanced
    case "date":
    case "time": {
      return (
        <div className="flex flex-col gap-2">
          {commonLabel && <Label htmlFor={element.id}>{commonLabel}</Label>}
          <Input
            id={element.id}
            type={element.type}
            disabled={disabled}
            value={(value as string | undefined) ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
      )
    }
    case "address": {
      return (
        <div className="flex flex-col gap-2">
          {commonLabel && <Label>{commonLabel}</Label>}
          <Input placeholder="Street" disabled={disabled} />
          <Input placeholder="City" disabled={disabled} />
          <Input placeholder="State" disabled={disabled} />
          <Input placeholder="Postal code" disabled={disabled} />
        </div>
      )
    }

    default:
      return <div className="text-xs text-muted-foreground">Unsupported field type: {element.type}</div>
  }
}

export default ElementPanel


