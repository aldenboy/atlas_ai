import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  text: string;
  isUser: boolean;
  paper?: string;
}

export const useChat = () => {
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

  const handleDownloadPaper = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('research_papers')
        .download(filePath);
      
      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'research-paper.md';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Research paper downloaded successfully.",
      });
    } catch (error: any) {
      console.error('Error downloading paper:', error);
      toast({
        title: "Error",
        description: "Failed to download research paper. Please try again.",
        variant: "destructive"
      });
    }
  };

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

  return {
    message,
    messages,
    currentTicker,
    isLoading,
    setMessage,
    setMessages,
    setCurrentTicker,
    setIsLoading,
    handleDownloadPaper,
    handleRefresh,
  };
};