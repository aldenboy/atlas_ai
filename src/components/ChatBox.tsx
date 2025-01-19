import { useChat } from "@/hooks/useChat";
import { atlasService } from "@/services/atlasService";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { ShillMeButton } from "./chat/ShillMeButton";

export const ChatBox = () => {
  const { 
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
  } = useChat();
  
  const { toast } = useToast();

  const handleShillMe = async () => {
    if (isLoading) return;
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
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
      <div className="absolute top-4 right-20 z-10">
        <ShillMeButton onClick={handleShillMe} disabled={isLoading} />
      </div>
      <ChatMessages 
        messages={messages} 
        onDownloadPaper={handleDownloadPaper}
      />
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