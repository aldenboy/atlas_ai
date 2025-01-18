import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";

const Index = () => {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 relative">
      <NeuralBackground />
      <div className="w-full max-w-2xl mx-auto">
        <ChatBox />
      </div>
    </div>
  );
};

export default Index;