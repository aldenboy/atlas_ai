import { atlasService } from "@/services/atlasService";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/types/chat";

export const handleShillRequest = async (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    const data = await atlasService.getRandomShill();
    setMessages((prev) => [
      ...prev,
      { text: "Shill me a random trending crypto! 🚀", isUser: true },
      { 
        text: data.response, 
        isUser: false,
        paper: data.paper
      }
    ]);
  } catch (error: any) {
    console.error('Error getting shill:', error);
    toast({
      title: "Error",
      description: "Failed to get crypto shill. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const handleChatSubmission = async (
  message: string,
  currentTicker: string | null,
  setCurrentTicker: (ticker: string | null) => void,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  try {
    if (!currentTicker) {
      const ticker = message.trim().toUpperCase();
      setCurrentTicker(ticker);
      const data = await atlasService.analyzeToken(ticker);
      setMessages((prev) => [
        ...prev,
        { 
          text: data.response, 
          isUser: false,
          paper: data.paper
        }
      ]);
    } else {
      const data = await atlasService.askQuestion(message, currentTicker);
      setMessages((prev) => [
        ...prev,
        { 
          text: data.response, 
          isUser: false,
          paper: data.paper
        }
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
    throw error;
  }
};