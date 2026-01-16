import React from 'react'

interface ChatBubbleProps {
  message: string
  isAI?: boolean
}

const ChatBubble = ({ message, isAI = false }: ChatBubbleProps) => {
  if (isAI) {
    return (
      <div className="w-full py-2">
        <p className="text-sm">{message}</p>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-end py-2">
      <div className="w-fit max-w-[60%] bg-muted/60 rounded-2xl p-3">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

export default ChatBubble
