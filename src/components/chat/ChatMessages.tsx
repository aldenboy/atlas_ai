interface Message {
  text: string;
  isUser: boolean;
  paper?: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.isUser ? "justify-end" : "justify-start"} mb-4`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              msg.isUser
                ? "bg-purple-600/90 text-white"
                : "bg-white/10 text-white backdrop-blur-sm"
            }`}
          >
            {msg.text.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>
                {line}
              </p>
            ))}
            {msg.paper && (
              <div className="mt-4 p-2 bg-purple-500/20 rounded">
                <a 
                  href={msg.paper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 flex items-center gap-2"
                >
                  📑 Download Research Paper
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};