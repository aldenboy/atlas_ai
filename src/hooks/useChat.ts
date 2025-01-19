import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/types/chat";

export const useChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
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
      // First, check if the file exists
      const { data: fileExists, error: checkError } = await supabase.storage
        .from('research_papers')
        .list(filePath.split('/')[0]);

      if (checkError) throw checkError;
      
      if (!fileExists || fileExists.length === 0) {
        throw new Error('Research paper not found');
      }

      // If file exists, proceed with download
      const { data, error } = await supabase.storage
        .from('research_papers')
        .download(filePath);
      
      if (error) throw error;

      // Create and trigger download
      const blob = new Blob([data], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'research-paper.md';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
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
        description: error.message || "Failed to download research paper. Please try again.",
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