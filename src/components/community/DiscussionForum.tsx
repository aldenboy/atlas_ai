import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DiscussionThread } from "./DiscussionThread";
import { NewDiscussionForm } from "./NewDiscussionForm";

export const DiscussionForum = () => {
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);

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
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Community Discussions</CardTitle>
        <Button onClick={() => setShowNewDiscussion(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discussions?.map((discussion) => (
            <DiscussionThread key={discussion.id} discussion={discussion} />
          ))}
        </div>
        {showNewDiscussion && (
          <NewDiscussionForm onClose={() => setShowNewDiscussion(false)} />
        )}
      </CardContent>
    </Card>
  );
};