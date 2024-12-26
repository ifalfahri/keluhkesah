"use client";

import { useEffect, useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import { IMessage } from "./types/types";

export default function Home() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [userName, setUserName] = useState("Anonymous");

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      // Check for new messages (placeholder for WebSocket)
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addMessage = (text: string) => {
    const newMessage: IMessage = {
      id: Date.now().toString(),
      userName,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4 flex flex-row justify-between items-center">
        <h1 className="text-2xl font-extrabold">Keluh Kesah</h1>
        <a href="https://github.com/ifalfahri" className="px-4 py-2 bg-black rounded">Github</a>
      </header>
      <main className="flex-grow overflow-hidden">
        <div className="mx-auto h-full flex flex-col">
          <MessageList messages={messages} />
          <MessageInput
            onSendMessage={addMessage}
            userName={userName}
            onChangeUserName={setUserName}
          />
        </div>
      </main>
    </div>
  );
}
