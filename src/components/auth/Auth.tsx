import { NeuralBackground } from "@/components/NeuralBackground";
import { AuthProjectOverview } from "./AuthProjectOverview";

export const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <NeuralBackground />
      
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary animate-fade-in">
          Welcome to Atlas
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-8 animate-fade-in delay-100">
          Your AI-Powered Market Intelligence Platform
        </p>
        
        <div className="max-w-lg mx-auto">
          <AuthProjectOverview />
        </div>
      </div>
    </div>
  );
};