import { useRef, useEffect } from 'react'
import Message from './Message'
import { IMessage } from '../types/types'

interface MessageListProps {
  messages: IMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  return (
    <div className="flex-grow overflow-y-auto p-4" role="log" aria-label="Message list">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

