import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import React from 'react'
import { Button } from '../ui/button';
import { ArrowUp, FileIcon, Send } from 'lucide-react';

interface ChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  model?: string;
  disabled?: boolean;
  loading?: boolean;
  currentPage?: number | string
}

const ChatInput = ({
  onSend,
  placeholder = "Enter a prompt to start building..",
  model = "Gemini 2.1",
  disabled = false,
  loading = false,
  currentPage
}: ChatInputProps) => {
  return (
    <div className='w-full h-fit  p-4'>
    <div className='w-full h-fit rounded-xl  border-[0.5px]  p-3'>
        <div className='flex flex-row gap-2 items-center'>
            <p className='text-xs text-muted-foreground bg-muted-foreground/10 border-[0.5px] px-2 py-0.5 rounded-sm mb-1 flex items-center gap-1 '>
            <FileIcon size={12} />
            Page {currentPage} (active)</p>
        </div>
        <textarea 
          placeholder={placeholder}
          className='w-full !h-[60px] max-h-[60px] resize-none text-sm  outline-none  mt-2'
          disabled={disabled}
        />
        <div>
          <div className=" w-full flex items-center justify-between">
            <div className='flex items-center gap-2 text-xs px-2 text-muted-foreground'>
              <b>Model:</b>
              <p>{model}</p>
            </div>

            <Button 
              variant={"secondary"}
              className='rounded-xl text-sm !h-8'
              onClick={() => onSend?.("")}
              disabled={disabled || loading}
            >
              Send <ArrowUp size={14} />
            </Button>
          </div>
        </div>
        </div>
    </div>
  )
}

export default ChatInput;