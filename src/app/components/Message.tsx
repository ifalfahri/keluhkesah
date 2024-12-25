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
        <div className="mt-2 flex flex-wrap gap-1">
          {Object.entries(messageReactions).map(([reaction, count]) => (
            <span key={reaction} className="bg-white rounded-full px-2 py-1 text-sm">
              {reaction} {count}
            </span>
          ))}
        </div>
        <button 
        onClick={() => setShowReactions(!showReactions)}
        className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow"
        aria-label="Add reaction"
      ><Smile size={20} />
      </button>
      {showReactions && (
        <div className="absolute bottom-10 right-0 bg-white rounded-lg shadow-lg p-2 flex gap-1">
          {reactions.map(reaction => (
            <button
              key={reaction}
              onClick={() => addReaction(reaction)}
              className="text-2xl hover:bg-gray-100 rounded p-1"
              aria-label={`React with ${reaction}`}
            >
              {reaction}
            </button>
          ))}
        </div>
      )}
      </div>
    )
  }
  
  