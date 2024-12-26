"use client";

import { useEffect, useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import { IMessage } from "./types/types";
import { Github } from "lucide-react";

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
      <header className="bg-sky-400 text-white p-4 flex flex-row justify-between items-center">
        <h1 className="text-2xl font-extrabold">Keluh Kesah</h1>
        <a href="https://github.com/ifalfahri/keluhkesah" className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-4 font-medium text-neutral-200 duration-500">
          <div className="relative inline-flex -translate-x-0 items-center transition group-hover:-translate-x-6">
            <div className="absolute translate-x-0 opacity-100 transition group-hover:-translate-x-6 group-hover:opacity-0">
              <Github className="h-4 -ml-1" />
            </div>
            <span className="pl-6">Github</span>
            <div className="absolute right-0 translate-x-12 opacity-0 transition group-hover:translate-x-6 group-hover:opacity-100">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <path
                  d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </a>
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
