import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";
import { TickerTape } from "@/components/TickerTape";
import { NewsTickerTape } from "@/components/NewsTickerTape";
import { DiscussionForum } from "@/components/community/DiscussionForum";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 relative">
      <NeuralBackground />
      <div className="w-full fixed top-0 z-10">
        <NewsTickerTape />
      </div>
      
      <div className="absolute top-4 right-4 z-20">
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
      
      <div className="flex-1 container mx-auto mt-16 mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ChatBox />
        </div>
        <div className="space-y-6">
          <DiscussionForum />
        </div>
      </div>
      
      <div className="w-full fixed bottom-0">
        <TickerTape />
      </div>
    </div>
  );
};

export default Index;