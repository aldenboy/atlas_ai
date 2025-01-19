import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useDiscussions } from "@/hooks/useDiscussions";
import { ForumHeader } from "./ForumHeader";
import { DiscussionList } from "./DiscussionList";
import { NewDiscussionForm } from "./NewDiscussionForm";
import { SortControls } from "./SortControls";

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
    <Card className="border border-purple-500/20 bg-black/30 backdrop-blur-md rounded-xl p-6 h-full">
      <ForumHeader 
        showAllTopics={showAllTopics} 
        onNewDiscussion={handleNewDiscussion} 
      />
      <CardContent className="px-0">
        {showAllTopics && (
          <SortControls sortBy={sortBy} onSortChange={setSortBy} />
        )}

        <DiscussionList 
          discussions={discussions || []} 
          isLoading={isLoading} 
        />
        
        {showNewDiscussion && (
          <NewDiscussionForm onClose={() => setShowNewDiscussion(false)} />
        )}
      </CardContent>
    </Card>
  );
};