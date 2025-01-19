import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";
import { TickerTape } from "@/components/TickerTape";
import { NewsTickerTape } from "@/components/NewsTickerTape";
import { DiscussionForum } from "@/components/community/DiscussionForum";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <NeuralBackground />
      
      <div className="sticky top-0 w-full z-10">
        <NewsTickerTape />
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto w-full mb-8">
          <ChatBox />
        </div>
        <div className="w-full">
          <DiscussionForum showAllTopics={false} />
        </div>
      </main>
      
      <div className="sticky bottom-0 w-full z-10">
        <TickerTape />
      </div>
    </div>
  );
};

export default Index;