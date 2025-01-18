import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ChatHeaderProps {
  currentTicker: string | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ChatHeader = ({ currentTicker, onRefresh, isLoading }: ChatHeaderProps) => {
  return (
    <div className="bg-purple-900/30 p-4 border-b border-purple-500/20 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-white">ATLAS</h1>
        <p className="text-purple-200/70 text-sm">Automated Trading and Learning Analysis System</p>
        {currentTicker && (
          <p className="text-purple-200/90 text-sm mt-1">Currently analyzing: {currentTicker}</p>
        )}
      </div>
      <Button
        onClick={onRefresh}
        variant="ghost"
        size="icon"
        className="text-purple-200 hover:text-white hover:bg-purple-500/20"
        disabled={isLoading}
      >
        <RefreshCw className="h-5 w-5" />
      </Button>
    </div>
  );
};