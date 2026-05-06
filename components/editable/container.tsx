import React from 'react'
import { TypographyH1 } from '../ui/typography';
import EditableWrapper from './wrapper';
import FormElementRenderer from '../form/element-renderer';
import type { FormField } from '@/lib/types';
import { Input } from '../ui/input';
import { useApp } from '@/contexts/app';

interface EditableElementContainerProps {
  pageId: string;
  element?: FormField;
  children?: React.ReactNode;
  onChange?: (value: any) => void;
}

const EditableElementContainer = ({ pageId, element, children, onChange }: EditableElementContainerProps) => {
  const { selectedElementId, setSelectedElementId, setRightPanelTab, updateElementById } = useApp()
  const isSelected = element ? selectedElementId === element.id : false

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!element) return
    e.stopPropagation()
    setSelectedElementId(element.id)
    setRightPanelTab("properties")
  }
  // If no element is provided, render children (fallback for existing usage)
  if (!element) {
    return (
      <div data-focusable-element="true" className="w-full h-fit rounded-lg border border-dotted p-6 flex flex-col">
        <EditableWrapper>
          <b className='text-md' contentEditable={true} 
          onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
          onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}>Title</b>
        </EditableWrapper>
        <p className='text-xs text-muted-foreground mb-2' onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
        contentEditable={true}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro veniam culpa molestias? Explicabo doloribus, molestiae vitae </p>
        {children}
      </div>
    )
  }

  // For layout/display elements, render them directly without container styling
  if (['heading', 'description', 'markdown', 'headingDescriptionGroup', 'divider', 'media', 'pageBreak'].includes(element.type)) {
    return (
      <div
        data-focusable-element="true"
        data-element-id={element.id}
        onClick={handleSelect}
        className={`scroll-mt-20 w-full h-fit rounded-md transition-colors ${isSelected ? "ring-2 ring-primary/60 bg-primary/5" : "hover:bg-muted/20"}`}
      >
        <FormElementRenderer element={element} disabled />
      </div>
    )
  }

  // For form elements, render with container styling
  return (
    <div
      data-focusable-element="true"
      data-element-id={element.id}
      onClick={handleSelect}
      className={`scroll-mt-20 w-full h-fit rounded-lg border border-dotted p-6 flex flex-col transition-colors ${isSelected ? "ring-2 ring-primary/60 bg-primary/5" : "hover:bg-muted/20"}`}
    >
      <EditableWrapper>
          {/* {element.required && <span className="text-destructive ml-1">*</span>} */}
        <b className='text-md'>{element.title} {element.required && <span className="text-destructive ml-1">*</span>}</b>
      </EditableWrapper>
      {element.description && (
      <EditableWrapper className='mb-2'>
        <p className='text-xs text-muted-foreground'>{element.description}</p>
        </EditableWrapper>
      )}
      <FormElementRenderer element={element} disabled />
      {children}
       <div className='flex items-center gap-2 text-xs my-3'>
       <Input 
         type='checkbox' 
         className='h-3 w-3' 
         checked={element.required || false} 
         id={`required-checkbox-${element.id}`}
         onChange={(e) => {
           updateElementById(pageId, element.id, (currentElement) => ({
             ...currentElement,
             required: e.target.checked,
           }))
         }}
         onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
         onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
       /> <label id='required-label' htmlFor={`required-checkbox-${element.id}`}>Required</label>
       </div>
    </div>
  )
}

export default EditableElementContainer;