import { IMessage } from '../types/types'

interface MessageProps {
  message: IMessage
}

function generateColor(name: string) {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = hash % 360
    return `hsl(${hue}, 70%, 80%)`
  }

export default function Message({ message }: MessageProps) {

    const bubbleColor = generateColor(message.userName)

    return (
      <div className="mb-4 relative">
        <div className="rounded-lg shadow p-4" 
        style={{ backgroundColor: bubbleColor }}>
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-bold text-blue-600">{message.userName}</span>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-800">{message.text}</p>
        </div>
      </div>
    )
  }
  
  