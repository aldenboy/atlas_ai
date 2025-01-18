import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DiscussionThread } from "./DiscussionThread";
import { NewDiscussionForm } from "./NewDiscussionForm";
import { useToast } from "@/components/ui/use-toast";

export const DiscussionForum = () => {
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

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

  const { data: discussions, isLoading } = useQuery({
    queryKey: ["discussions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`
          *,
          discussion_comments (count)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching discussions:", error);
        throw error;
      }
      return data;
    }
  });

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Community Discussions</CardTitle>
        <Button onClick={handleNewDiscussion} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discussions?.map((discussion) => (
            <DiscussionThread key={discussion.id} discussion={discussion} />
          ))}
          {discussions?.length === 0 && !isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              No discussions yet. Be the first to start one!
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