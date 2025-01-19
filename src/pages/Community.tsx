import { DiscussionForum } from "@/components/community/DiscussionForum";
import { Button } from "@/components/ui/button";
import { Home, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Community = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error("No session found");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
          <DiscussionForum showAllTopics={true} />
        </div>
      </main>
    </div>
  );
};

export default Community;