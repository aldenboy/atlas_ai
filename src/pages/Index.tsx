import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";
import { TickerTape } from "@/components/TickerTape";
import { NewsTickerTape } from "@/components/NewsTickerTape";
import { DiscussionForum } from "@/components/community/DiscussionForum";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AuthProjectOverview } from "@/components/auth/AuthProjectOverview";
import { useAuth } from "@/contexts/AuthContext";
import { CryptoPriceChart } from "@/components/CryptoPriceChart";
import { useChat } from "@/hooks/useChat";
import { useEffect, useState } from "react";

const Index = () => {
  const { session, signOut } = useAuth();
  const { currentTicker } = useChat();
  const [chartSymbol, setChartSymbol] = useState('bitcoin');

  // Update chart when Atlas changes the current ticker
  useEffect(() => {
    if (currentTicker) {
      setChartSymbol(currentTicker.toLowerCase());
    }
  }, [currentTicker]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <NeuralBackground />
      
      <div className="sticky top-0 w-full z-10">
        <NewsTickerTape />
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="w-full">
            <ChatBox />
          </div>
          <div className="w-full">
            <AuthProjectOverview />
          </div>
        </div>
        
        <div className="w-full mb-16">
          <CryptoPriceChart symbol={chartSymbol} />
        </div>
        
        <div className="w-full">
          <DiscussionForum showAllTopics={false} />
        </div>
      </main>
      
      <div className="sticky bottom-0 w-full z-10">
        <TickerTape />
      </div>

      {session && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button variant="outline" size="sm" onClick={signOut} className="bg-background/50 backdrop-blur-sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;