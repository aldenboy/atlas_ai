import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <NeuralBackground />
      <ChatBox />
    </div>
  );
};

export default Index;