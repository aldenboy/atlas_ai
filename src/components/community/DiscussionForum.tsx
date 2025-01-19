import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { DiscussionThread } from "./DiscussionThread";
import { NewDiscussionForm } from "./NewDiscussionForm";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { SortControls } from "./SortControls";
import { useDiscussions } from "@/hooks/useDiscussions";

type SortOption = "trending" | "new" | "top";

interface DiscussionForumProps {
  showAllTopics?: boolean;
}

export const DiscussionForum = ({ showAllTopics = false }: DiscussionForumProps) => {
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const { toast } = useToast();

  const { data: discussions, isLoading } = useDiscussions(sortBy, showAllTopics ? undefined : 2);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNewDiscussion = () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a discussion.",
        variant: "destructive",
      });
      return;
    }
    setShowNewDiscussion(true);
  };

  return (
    <Card className="border border-purple-500/20 bg-black/30 backdrop-blur-md rounded-xl p-6">
      <CardHeader className="flex flex-row items-center justify-between px-0 pt-0">
        <CardTitle className="text-2xl font-bold">Community</CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleNewDiscussion} size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
          {!showAllTopics && (
            <Button asChild size="sm" variant="outline">
              <Link to="/community">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {showAllTopics && (
          <SortControls sortBy={sortBy} onSortChange={setSortBy} />
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">Loading discussions...</p>
            </div>
          ) : discussions && discussions.length > 0 ? (
            discussions.map((discussion) => (
              <DiscussionThread key={discussion.id} discussion={discussion} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg">No discussions yet</p>
              <p className="text-sm">Be the first to start a discussion!</p>
            </div>
          )}
        </div>
        
        {showNewDiscussion && (
          <NewDiscussionForm onClose={() => setShowNewDiscussion(false)} />
        )}
      </CardContent>
    </Card>
  );
};