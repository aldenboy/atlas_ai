import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";
import { TickerTape } from "@/components/TickerTape";
import { NewsTickerTape } from "@/components/NewsTickerTape";
import { DiscussionForum } from "@/components/community/DiscussionForum";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

const Index = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Ensure the page scrolls to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <NeuralBackground />
      
      <div className="sticky top-0 w-full z-10">
        <NewsTickerTape />
      </div>
      
      <main className="flex-1 w-full relative z-10">
        <div className={`mx-auto w-full ${isMobile ? 'px-2 py-4' : 'container px-4 py-16'}`}>
          <div className={`mx-auto w-full ${!isMobile && 'max-w-3xl'} mb-4`}>
            <ChatBox />
          </div>
          <div className="w-full">
            <DiscussionForum showAllTopics={false} />
          </div>
        </div>
      </main>
      
      <div className="sticky bottom-0 w-full z-10">
        <TickerTape />
      </div>
    </div>
  );
};

export default Index;