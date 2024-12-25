import { useState } from 'react'

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  userName: string;
  onChangeUserName: (name: string) => void;
}

export default function MessageInput({ onSendMessage, userName, onChangeUserName }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
      <div className="flex mb-4">
        <input
          type="text"
          value={userName}
          onChange={(e) => onChangeUserName(e.target.value)}
          placeholder="Your Name"
          className="flex-grow mr-2 p-2 border rounded"
          aria-label="Your name"
        />
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow mr-2 p-2 border rounded"
          aria-label="Message"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </form>
  )
}

