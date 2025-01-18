import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! How can I assist you today?", isUser: false },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "I'm processing your request...", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-purple-500/20">
      <div className="h-[500px] p-4 overflow-y-auto">
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
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-purple-500/20 bg-black/20">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border-purple-500/30 text-white placeholder:text-purple-300/50 focus-visible:ring-purple-500/50"
          />
          <Button 
            type="submit" 
            className="bg-purple-600/90 hover:bg-purple-700/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};