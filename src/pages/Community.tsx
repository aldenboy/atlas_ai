import { DiscussionForum } from "@/components/community/DiscussionForum";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SignInForm } from "@/components/auth/SignInForm";

const Community = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

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
            <DialogTitle>Sign in to your account</DialogTitle>
            <DialogDescription>
              Sign in to your account to join the discussion
            </DialogDescription>
          </DialogHeader>
          <SignInForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;