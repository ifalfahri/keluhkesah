"use client"

import { IMessage } from '../types/types'
import { useState } from 'react'
import { Smile } from 'lucide-react'

interface MessageProps {
  message: IMessage
}

const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡']

function generateColor(name: string) {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 80%)`
  }

export default function Message({ message }: MessageProps) {
    const [showReactions, setShowReactions] = useState(false)
    const [messageReactions, setMessageReactions] = useState<Record<string, number>>({})

    const addReaction = (reaction: string) => {
        setMessageReactions(prev => ({
          ...prev,
          [reaction]: (prev[reaction] || 0) + 1
        }))
        setShowReactions(false)
      }
    

    const bubbleColor = generateColor(message.userName)

    return (
      <div className="mb-4 relative">
        <div className="rounded-lg shadow p-4" 
        style={{ backgroundColor: bubbleColor }}>
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-bold text-gray-800">{message.userName}</span>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-800">{message.text}</p>
        </div>
      </div>
    )
  }
  
  