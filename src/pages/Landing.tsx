import { NeuralBackground } from "@/components/NeuralBackground";
import { Button } from "@/components/ui/button";
import { Bitcoin, ChartBar, Globe, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <NeuralBackground />
      
      {/* Hero Section with Project Overview */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-20 pb-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            ATLAS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in delay-100">
            Automated Trading and Learning Analysis System
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in delay-200">
            An advanced AI-powered platform for cryptocurrency market analysis, 
            sentiment tracking, and community-driven insights.
          </p>
          <Link to="/app">
            <Button size="lg" className="animate-fade-in delay-300 bg-primary hover:bg-primary/90">
              <Rocket className="mr-2" />
              Launch App
            </Button>
          </Link>
        </div>

        {/* Blockchain Introduction */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-primary/20 hover:border-primary/40 transition-all animate-fade-in delay-400">
              <Bitcoin className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Cryptocurrency Markets</h3>
              <p className="text-gray-400">
                Access real-time market data, track price movements, and analyze trends 
                across major cryptocurrencies and tokens.
              </p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-primary/20 hover:border-primary/40 transition-all animate-fade-in delay-500">
              <ChartBar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Market Analysis</h3>
              <p className="text-gray-400">
                Leverage AI-powered sentiment analysis and technical indicators to make 
                informed trading decisions.
              </p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-primary/20 hover:border-primary/40 transition-all animate-fade-in delay-600">
              <Globe className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-4">Global Community</h3>
              <p className="text-gray-400">
                Join a vibrant community of traders and analysts. Share insights, 
                discuss strategies, and stay updated with market news.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;