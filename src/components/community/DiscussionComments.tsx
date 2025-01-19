import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CommentForm } from "./comment/CommentForm";
import { CommentList } from "./comment/CommentList";

interface DiscussionCommentsProps {
  discussionId: string;
}

export const DiscussionComments = ({ discussionId }: DiscussionCommentsProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: comments, isLoading } = useQuery({
    queryKey: ["discussion-comments", discussionId, refreshKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussion_comments")
        .select("*")
        .eq("discussion_id", discussionId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCommentUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <CommentForm 
        discussionId={discussionId} 
        onCommentAdded={handleCommentUpdate} 
      />
      <CommentList 
        comments={comments || []} 
        onCommentUpdate={handleCommentUpdate} 
      />
    </div>
  );
};