import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-600 to-purple-600 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Next-Generation AI
            <br />
            <span className="inline-flex items-center">
              Powered by Advanced LLMs
              <Sparkles className="ml-2 h-8 w-8 animate-float" />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Experience the power of state-of-the-art language models. Our AI understands context,
            generates creative content, and helps you solve complex problems.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="link" className="text-white hover:text-gray-200">
              Learn more →
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMTBoMnYyMHptLTIgMGgtMlYxMGgydjIwem0tMiAwaC0yVjEwaDJ2MjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
    </div>
  );
};