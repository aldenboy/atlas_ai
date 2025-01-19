import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatBox } from "@/components/ChatBox";
import { NeuralBackground } from "@/components/NeuralBackground";
import { TickerTape } from "@/components/TickerTape";
import { NewsTickerTape } from "@/components/NewsTickerTape";
import { DiscussionForum } from "@/components/community/DiscussionForum";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Index = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<"sign_in" | "sign_up">("sign_in");
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <NeuralBackground />
      
      <div className="sticky top-0 w-full z-10">
        <NewsTickerTape />
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto w-full mb-8">
          <ChatBox />
        </div>
        <div className="w-full">
          <DiscussionForum 
            showAllTopics={false} 
            onAuthRequired={() => setShowAuthDialog(true)}
          />
        </div>
      </main>
      
      <div className="sticky bottom-0 w-full z-10">
        <TickerTape />
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setShowAuthDialog(true)} className="bg-background/50 backdrop-blur-sm">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{authView === "sign_up" ? "Create an account" : "Sign in"}</DialogTitle>
            <DialogDescription>
              {authView === "sign_up" 
                ? "Join our community to participate in discussions" 
                : "Sign in to your account to join the discussion"}
            </DialogDescription>
          </DialogHeader>
          {authView === "sign_up" ? (
            <SignUpForm onViewChange={setAuthView} />
          ) : (
            <SignInForm onViewChange={setAuthView} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;