"use client"

import React, { useEffect, useRef } from 'react'
import ChatBubble from '@/components/chat/bubble'
import ChatInput from '@/components/chat/input'
import { SparkleIcon } from 'lucide-react'
import { IconSparkles } from '@tabler/icons-react'
import { useApp } from '@/contexts/app'

interface ChatMessage {
  id: string | number
  text: string
  isAI?: boolean
}

interface ChatPanelProps {
  messages?: ChatMessage[]
  onSend?: (message: string) => void
  disabled?: boolean
  loading?: boolean
}

const ChatPanel = ({
  messages = [
    { id: 1, text: 'Hello, how are you?', isAI: true },
    { id: 2, text: "I'm fine, thank you!", isAI: false },
  ],
  onSend,
  disabled,
  loading,
}: ChatPanelProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const {currentPageId} = useApp()

  useEffect(() => {
    // Always keep the latest message in view
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div className="flex min-h-0 flex-col w-full h-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="min-h-full flex flex-col justify-end space-y-2">
        <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground text-center'>
          <IconSparkles fill='var(--muted-foreground)' className='opacity-20' size={70} /> 
          <p className='text-lg font-medium'>AI Assistant</p>
          <p className='text-xs'>ask, create, modify and publish your projects with AI. the agent session memory is linked to each project created.</p>
          <p className='text-xs opacity-40'>powered by <span className='font-medium'>Gemini 2.1</span></p>
          <br />
          <p className='text-xs bg-muted/10 px-3 py-1 rounded-full'>Today</p>
        </div>
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m.text} isAI={m.isAI} />
          ))}
          <div ref={endRef} />
        </div>
      </div>
      <div className="">
        <ChatInput onSend={onSend} disabled={!!disabled} loading={!!loading} currentPage={currentPageId?.split("-")[1] ?? 1} />
      </div>
    </div>
  )
}

export default ChatPanel


