import React from 'react'
import { cn } from '@/lib/utils'

const EditableWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("w-fit h-fit border-dotted border-[0.5px]", className)}>
      {children}
    </div>
  )
}

export default EditableWrapper;