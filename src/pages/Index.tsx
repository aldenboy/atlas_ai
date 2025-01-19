import { Button } from "@/components/ui/button";
import { NeuralBackground } from "@/components/NeuralBackground";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const handleLaunchApp = () => {
    // Redirect to the main app domain
    window.location.href = "https://app.lovable.app";
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <NeuralBackground />
      
      <main className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          ATLAS
          <span className="block text-2xl md:text-3xl text-gray-200 mt-2">
            Automated Trading and Learning Analysis System
          </span>
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Experience the power of advanced AI-driven market analysis and automated trading strategies. 
            ATLAS combines cutting-edge technology with real-time market data to provide you with 
            intelligent insights and trading opportunities.
          </p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-300">Advanced algorithms analyze market trends and sentiment in real-time</p>
              </div>
              
              <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">Market Intelligence</h3>
                <p className="text-gray-300">Comprehensive insights into market movements and trading opportunities</p>
              </div>
              
              <div className="bg-secondary/50 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-2">Community Driven</h3>
                <p className="text-gray-300">Join a vibrant community of traders sharing insights and strategies</p>
              </div>
            </div>
            
            <Button 
              size="lg" 
              onClick={handleLaunchApp}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
            >
              Launch App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;