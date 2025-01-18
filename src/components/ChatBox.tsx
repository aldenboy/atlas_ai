import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { 
      text: "Hello! I'm ATLAS (Automated Trading and Learning Analysis System). To get started, please enter a ticker symbol (e.g., BTC, ETH) or project name you'd like me to research.", 
      isUser: false 
    },
  ]);
  const [currentTicker, setCurrentTicker] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    // Check if this is the first user message (ticker input)
    if (!currentTicker) {
      const ticker = message.trim().toUpperCase();
      setCurrentTicker(ticker);
      
      // Respond with confirmation and next steps
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { 
            text: `Thank you! I'll analyze ${ticker} for you. What specific information would you like to know? You can ask about:\n\n• Price analysis\n• Market trends\n• Trading volume\n• Historical performance\n• Recent news`, 
            isUser: false 
          },
        ]);
      }, 1000);
    } else {
      // Handle subsequent messages about the current ticker
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { 
            text: `I'm analyzing ${currentTicker} based on your request: "${message}". Please wait while I gather the information...`, 
            isUser: false 
          },
        ]);
      }, 1000);
    }

    setMessage("");
  };

  return (
    <div className="w-full h-[100dvh] md:h-[500px] flex flex-col bg-black/30 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-purple-500/20">
      <div className="bg-purple-900/30 p-4 border-b border-purple-500/20">
        <h1 className="text-2xl font-bold text-white">ATLAS</h1>
        <p className="text-purple-200/70 text-sm">Automated Trading and Learning Analysis System</p>
        {currentTicker && (
          <p className="text-purple-200/90 text-sm mt-1">Currently analyzing: {currentTicker}</p>
        )}
      </div>
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
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-purple-500/20 bg-black/20">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={currentTicker 
              ? "Ask anything about " + currentTicker + "..."
              : "Enter a ticker symbol or project name..."
            }
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