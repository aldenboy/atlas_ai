import { useChat } from "@/hooks/useChat";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { ShillMeButton } from "./chat/ShillMeButton";
import { handleShillRequest, handleChatSubmission } from "@/services/chatService";

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
      await handleShillRequest(setMessages, toast);
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
      await handleChatSubmission(
        message,
        currentTicker,
        setCurrentTicker,
        setMessages,
        toast
      );
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