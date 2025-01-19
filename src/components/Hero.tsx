import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Hero = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            ATLAS
            <br />
            <span className="inline-flex items-center">
              Automated Trading and Learning Analysis System
              <Sparkles className="ml-2 h-8 w-8 animate-float" />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Experience the power of state-of-the-art language models. Our AI understands context,
            generates creative content, and helps you solve complex problems.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!isAuthenticated ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90 font-semibold"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="link" 
                  className="text-white hover:text-white/80"
                >
                  Learn more →
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJWMTBoMnYyMHptLTIgMGgtMlYxMGgydjIwem0tMiAwaC0yVjEwaDJ2MjB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
    </div>
  );
};