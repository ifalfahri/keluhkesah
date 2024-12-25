import { useState } from "react";
import MessageList from "./components/MessageList";

export default function Home() {
  const [messages] = useState([])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-extrabold">Keluh Kesah</h1>
      </header>
      <main>
        <div>
          <MessageList messages={messages} />
        </div>
      </main>
    </div>
  );
}
