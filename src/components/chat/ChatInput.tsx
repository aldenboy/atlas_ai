import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  currentTicker: string | null;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput = ({ 
  message, 
  currentTicker, 
  isLoading, 
  onMessageChange, 
  onSubmit 
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-purple-500/20 bg-black/20">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
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
  );
};