interface MessageProps {
  message: {
    userName: string;
    timestamp: string;
    text: string;
  };
}

export default function Message({ message }: MessageProps) {
    return (
      <div className="mb-4">
        <div className="bg-white rounded-lg shadow p-4">
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
  
  