import { DiscussionForum } from "@/components/community/DiscussionForum";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Community = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authView, setAuthView] = useState<"sign_in" | "sign_up">("sign_in");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hover:bg-secondary"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        <div className="w-full">
          <DiscussionForum 
            showAllTopics={true} 
            onAuthRequired={() => setShowAuthDialog(true)}
          />
        </div>
      </main>

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

export default Community;