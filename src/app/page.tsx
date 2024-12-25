"use client"

import { useState, useEffect } from "react";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

interface Message {
  id: string;
  userName: string;
  timestamp: string;
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [userName, setUserName] = useState('Anonymous')

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      // Check for new messages (placeholder for WebSocket)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const addMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      userName,
      text,
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, newMessage])
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-extrabold">Keluh Kesah</h1>
      </header>
      <main className="flex-grow overflow-hidden">
        <div className="container mx-auto h-full flex flex-col">
          <MessageList messages={messages} />
          <MessageInput 
            onSendMessage={addMessage} 
            userName={userName} 
            onChangeUserName={setUserName}  />
        </div>
      </main>
    </div>
  );
}