import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";
import { TickerTape } from "@/components/TickerTape";
import { NewsTickerTape } from "@/components/NewsTickerTape";

const Index = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 relative">
      <NeuralBackground />
      <div className="w-full fixed top-0">
        <NewsTickerTape />
      </div>
      <div className="w-full max-w-2xl mx-auto flex-1 flex items-center">
        <ChatBox />
      </div>
      <div className="w-full fixed bottom-0">
        <TickerTape />
      </div>
    </div>
  );
};

export default Index;