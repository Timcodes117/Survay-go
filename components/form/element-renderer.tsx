import React from 'react'
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { FormField } from '@/lib/types'
import { useApp } from '@/contexts/app'

interface FormElementRendererProps {
  element: FormField
  value?: unknown
  onChange?: (value: unknown) => void
  disabled?: boolean
}

const FormElementRenderer: React.FC<FormElementRendererProps> = ({
  element,
  value,
  onChange,
  disabled = false
}) => {
  const { formPages, setFormPages, cursorMode } = useApp()
  
  const handleChange = (newValue: unknown) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleOptionChange = (optionIndex: number, newValue: string) => {
    // Only update if element has options (radio, checkbox, select)
    if (!('options' in element) || !element.options) return
    
    const elementWithOptions = element as any // Type assertion for elements with options
    
    setFormPages(prevPages => 
      prevPages.map(page => ({
        ...page,
        elements: page.elements.map((el: any) => 
          el.id === element.id 
            ? { 
                ...el, 
                options: elementWithOptions.options?.map((option: string, index: number) => 
                  index === optionIndex ? newValue : option
                )
              }
            : el
        )
      }))
    )
  }

  const renderBasicInput = () => {
    const normalizedBasicValue =
      typeof value === "string" || typeof value === "number" ? value : ""
    const commonProps = {
      disabled,
      placeholder: element.placeholder,
      value: normalizedBasicValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value),
      className: "placeholder:text-muted-foreground",
      onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
      onMouseDown: (e: React.MouseEvent) => e.stopPropagation()
    }

    switch (element.type) {
      case 'text':
        return <Input type="text" {...commonProps} />
      case 'email':
        return <Input type="email" {...commonProps} />
      case 'password':
        return <Input type="password" {...commonProps} />
      case 'phone':
        return <Input type="tel" {...commonProps} />
      case 'number':
        return (
          <Input 
            type="number" 
            {...commonProps}
            min={element.min}
            max={element.max}
            step={element.step}
          />
        )
      case 'textarea':
        return (
          <Textarea
            disabled={disabled}
            placeholder={element.placeholder}
            value={typeof value === "string" ? value : ""}
            className="placeholder:text-muted-foreground"
            onChange={(e) => handleChange(e.target.value)}
            onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
            onMouseDown={(e: React.MouseEvent) => cursorMode !== "pan" && e.stopPropagation()}
          />
        )
      default:
        return <Input type="text" {...commonProps} />
    }
  }

  const renderChoiceInput = () => {
    switch (element.type) {
      case 'radio':
        return (
          <div className="space-y-2">
            {(element as any).options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${element.id}-${index}`}
                  name={element.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 text-primary"
                  onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
                  onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                />
                {!disabled && <Label htmlFor={`${element.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>}
                {disabled && <Input 
                  type="text" 
                  value={option} 
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
                  onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                />}
              </div>
            ))}
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {(element as any).options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${element.id}-${index}`}
                  value={option}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleChange([...currentValues, option])
                    } else {
                      handleChange(currentValues.filter((v: string) => v !== option))
                    }
                  }}
                  disabled={disabled}
                  className="h-4 w-4 text-primary"
                  onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
                  onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                />
               {!disabled && <Label htmlFor={`${element.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>}
               {disabled && <Input 
                  type="text" 
                  value={option} 
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
                  onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                />}

              </div>
            ))}
          </div>
        )
      
      case 'select':
        return (
          <Select
            value={typeof value === "string" ? value : ""}
            onValueChange={handleChange}
            disabled={disabled}
          >
            <SelectTrigger className="placeholder:text-muted-foreground">
              <SelectValue placeholder={element.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {(element as any).options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      default:
        return null
    }
  }

  const renderAdvancedInput = () => {
    switch (element.type) {
      case 'date':
        return (
          <Input
            type="date"
            disabled={disabled}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleChange(e.target.value)}
            className="placeholder:text-muted-foreground"
            onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
            onMouseDown={(e: React.MouseEvent) => cursorMode !== "pan" && e.stopPropagation()}
          />
        )
      
      case 'time':
        return (
          <Input
            type="time"
            disabled={disabled}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleChange(e.target.value)}
            className="placeholder:text-muted-foreground"
            onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
            onMouseDown={(e: React.MouseEvent) => cursorMode !== "pan" && e.stopPropagation()}
          />
        )
      
      case 'url':
        return (
          <Input
            type="url"
            disabled={disabled}
            placeholder={element.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleChange(e.target.value)}
            className="placeholder:text-muted-foreground"
            onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
            onMouseDown={(e: React.MouseEvent) => cursorMode !== "pan" && e.stopPropagation()}
          />
        )
      
      case 'address':
        return (
          <div className="space-y-2">
            <Textarea
              disabled={disabled}
              placeholder={element.placeholder || 'Enter address'}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => handleChange(e.target.value)}
              className="placeholder:text-muted-foreground"
              onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            />
          </div>
        )
      
      default:
        return null
    }
  }

  const renderFileMediaInput = () => {
    switch (element.type) {
      case 'file':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              disabled={disabled}
              accept={element.accept?.join(',')}
              onChange={(e) => {
                const file = e.target.files?.[0]
                handleChange(file)
              }}
              className="placeholder:text-muted-foreground"
              onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            />
            {element.maxSizeMB && (
              <p className="text-xs text-muted-foreground">
                Maximum file size: {element.maxSizeMB}MB
              </p>
            )}
          </div>
        )
      
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              disabled={disabled}
              accept={element.accept?.join(',') || 'image/*'}
              onChange={(e) => {
                const file = e.target.files?.[0]
                handleChange(file)
              }}
              className="placeholder:text-muted-foreground"
              onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            />
            {element.maxSizeMB && (
              <p className="text-xs text-muted-foreground">
                Maximum file size: {element.maxSizeMB}MB
              </p>
            )}
          </div>
        )
      case 'signature':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              disabled={disabled}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                handleChange(file)
              }}
              className="placeholder:text-muted-foreground"
              onPointerDown={(e: React.PointerEvent) => cursorMode !== "pan" && e.stopPropagation()}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            />
          </div>
        )
      
      default:
        return null
    }
  }

  const renderLayoutDisplay = () => {
    switch (element.type) {
      case 'heading': {
        const level = element.level && element.level >= 1 && element.level <= 6 ? element.level : 2
        const HeadingTag = `h${level}` as React.ElementType
        return (
          <HeadingTag className="text-lg font-semibold">
            {element.label || 'Untitled Heading'}
          </HeadingTag>
        )
      }
      
      case 'description':
        return (
          <p className="text-sm text-muted-foreground">
            {element.text || 'No description provided'}
          </p>
        )
      
      case "markdown":
        return (
          <div className="text-sm leading-6 text-foreground [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:list-decimal [&_p]:text-muted-foreground [&_ul]:list-disc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {element.content || "No content provided"}
            </ReactMarkdown>
          </div>
        )

      case 'headingDescriptionGroup':
        return (
          <div style={{ display: "flex", flexDirection: "column", rowGap: `${Math.max(0, element.gapY ?? 8)}px` }}>
            <h2 className="text-lg font-semibold">
              {element.heading || element.label || "Untitled Heading"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {element.text || "No description provided"}
            </p>
          </div>
        )
      
      case 'divider':
        return <hr className="border-t border-muted-foreground/25" />
      
      case 'media':
        return (
          <div className="space-y-2">
            {element.mediaType === 'image' && element.url && (
              <div className={element.imageWidth === "fixed" ? "w-[320px]" : "w-full"}>
                <img
                  src={element.url}
                  alt={element.label || 'Media'}
                  className={`h-[240px] w-full rounded-lg ${element.imageFit === "contain" ? "object-contain bg-muted/20" : "object-cover"}`}
                />
              </div>
            )}
            {element.mediaType === 'video' && element.url && (
              <video 
                src={element.url} 
                controls 
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>
        )
      
      case 'pageBreak':
        return (
          <div className="flex items-center justify-center py-8">
            <div className="flex-1 border-t border-muted-foreground/25"></div>
            <span className="px-4 text-xs text-muted-foreground">Page Break</span>
            <div className="flex-1 border-t border-muted-foreground/25"></div>
          </div>
        )
      
      default:
        return null
    }
  }

  // Determine which renderer to use based on element type
  const renderElement = () => {
    switch (element.type) {
      case "text":
      case "email":
      case "password":
      case "phone":
      case "number":
      case "textarea":
        return renderBasicInput()
      case "radio":
      case "checkbox":
      case "select":
        return renderChoiceInput()
      case "date":
      case "time":
      case "address":
      case "url":
        return renderAdvancedInput()
      case "file":
      case "image":
      case "signature":
        return renderFileMediaInput()
      case "heading":
      case "description":
      case "markdown":
      case "headingDescriptionGroup":
      case "divider":
      case "media":
      case "pageBreak":
        return renderLayoutDisplay()
      default:
        return <Input type="text" disabled placeholder="Unknown element type" />
    }
  }

  return (
    <div className="space-y-2">
      {/* {element.label && !['heading', 'description', 'headingDescriptionGroup', 'divider', 'media', 'pageBreak'].includes(element.type) && (
        <Label className="text-sm font-medium">
          {element.label}
          {element.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )} */}
      {renderElement()}
      {element.helpText && (
        <p className="text-xs text-muted-foreground">{element.helpText}</p>
      )}
    </div>
  )
}

export default FormElementRenderer
