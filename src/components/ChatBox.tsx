import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";

interface Message {
  text: string;
  isUser: boolean;
}

export const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
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
      if (!currentTicker) {
        const ticker = message.trim().toUpperCase();
        setCurrentTicker(ticker);
        
        const { data, error } = await supabase.functions.invoke('chat-with-atlas', {
          body: { 
            message: `The user has selected ${ticker} as their asset of interest. Please acknowledge this and ask what specific information they would like to know about ${ticker}. Suggest some specific aspects they might be interested in.`,
            currentTicker: ticker
          }
        });

        if (error) throw error;

        setMessages((prev) => [
          ...prev,
          { text: data.response, isUser: false }
        ]);
      } else {
        const { data, error } = await supabase.functions.invoke('chat-with-atlas', {
          body: { message, currentTicker }
        });

        if (error) throw error;

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
        { text: errorMessage, isUser: false }
      ]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="w-full h-[100dvh] md:h-[500px] flex flex-col bg-black/30 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-purple-500/20">
      <ChatHeader 
        currentTicker={currentTicker}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      <ChatMessages messages={messages} />
      <ChatInput
        message={message}
        currentTicker={currentTicker}
        isLoading={isLoading}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
      />
    </div>
  );
};