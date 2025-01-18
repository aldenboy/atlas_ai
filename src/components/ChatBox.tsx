import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { 
      text: "Hello! I'm ATLAS (Automated Trading and Learning Analysis System). To get started, please enter a ticker symbol (e.g., BTC, ETH) or project name you'd like me to research.", 
      isUser: false 
    },
  ]);
  const [currentTicker, setCurrentTicker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setMessages([
      { 
        text: "Hello! I'm ATLAS (Automated Trading and Learning Analysis System). To get started, please enter a ticker symbol (e.g., BTC, ETH) or project name you'd like me to research.", 
        isUser: false 
      },
    ]);
    setCurrentTicker(null);
    setMessage("");
    toast({
      title: "Conversation Reset",
      description: "The conversation has been reset. You can start a new analysis.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    try {
      // Check if this is the first user message (ticker input)
      if (!currentTicker) {
        const ticker = message.trim().toUpperCase();
        setCurrentTicker(ticker);
        
        const { data, error } = await supabase.functions.invoke('chat-with-atlas', {
          body: { 
            message: `The user has selected ${ticker} as their asset of interest. Please acknowledge this and ask what specific information they would like to know about ${ticker}. Suggest some specific aspects they might be interested in.`,
            currentTicker: ticker
          }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to get response from ATLAS');
        }

        setMessages((prev) => [
          ...prev,
          { text: data.response, isUser: false }
        ]);
      } else {
        const { data, error } = await supabase.functions.invoke('chat-with-atlas', {
          body: { message, currentTicker }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw new Error(error.message || 'Failed to get response from ATLAS');
        }

        setMessages((prev) => [
          ...prev,
          { text: data.response, isUser: false }
        ]);
      }
    } catch (error: any) {
      console.error('Error calling ATLAS:', error);
      
      let errorMessage = 'Failed to get response from ATLAS. Please try again.';
      let variant: "default" | "destructive" = "destructive";
      
      try {
        if (error.message && typeof error.message === 'string') {
          const errorBody = JSON.parse(error.message);
          if (errorBody.error) {
            errorMessage = errorBody.error;
            // If it's a rate limit error, use a less alarming toast style
            if (errorBody.isRateLimit) {
              variant = "default";
            }
          }
        }
      } catch {
        errorMessage = error.message || errorMessage;
      }
      
      toast({
        title: variant === "destructive" ? "Error" : "Please Wait",
        description: errorMessage,
        variant: variant
      });
      
      setMessages((prev) => [
        ...prev,
        { 
          text: errorMessage, 
          isUser: false 
        }
      ]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="w-full h-[100dvh] md:h-[500px] flex flex-col bg-black/30 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-purple-500/20">
      <div className="bg-purple-900/30 p-4 border-b border-purple-500/20 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">ATLAS</h1>
          <p className="text-purple-200/70 text-sm">Automated Trading and Learning Analysis System</p>
          {currentTicker && (
            <p className="text-purple-200/90 text-sm mt-1">Currently analyzing: {currentTicker}</p>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="icon"
          className="text-purple-200 hover:text-white hover:bg-purple-500/20"
          disabled={isLoading}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
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
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-purple-600/90 hover:bg-purple-700/90 transition-colors"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};