import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";
import { TickerTape } from "@/components/TickerTape";
import { NewsTickerTape } from "@/components/NewsTickerTape";
import { SentimentDashboard } from "@/components/market-sentiment/SentimentDashboard";
import { TradingJournal } from "@/components/trading-journal/TradingJournal";
import { DiscussionForum } from "@/components/community/DiscussionForum";

const Index = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col p-4 relative">
      <NeuralBackground />
      <div className="w-full fixed top-0">
        <NewsTickerTape />
      </div>
      
      <div className="flex-1 container mx-auto mt-16 mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SentimentDashboard />
          <TradingJournal />
        </div>
        <div className="space-y-6">
          <ChatBox />
          <DiscussionForum />
        </div>
      </div>
      
      <div className="w-full fixed bottom-0">
        <TickerTape />
      </div>
    </div>
  );
};

export default Index;