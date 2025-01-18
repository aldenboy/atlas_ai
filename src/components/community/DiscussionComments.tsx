import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { formatDistance } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export const DiscussionComments = ({ discussionId }: { discussionId: string }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: comments, refetch } = useQuery({
    queryKey: ["discussion-comments", discussionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussion_comments")
        .select("*")
        .eq("discussion_id", discussionId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("discussion_comments")
        .insert([
          {
            discussion_id: discussionId,
            content: newComment.trim(),
          },
        ]);

      if (error) throw error;

      setNewComment("");
      refetch();
      toast({
        title: "Comment posted",
        description: "Your comment has been added to the discussion.",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="bg-accent/50 rounded-lg p-4">
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })}
            </p>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px]"
        />
        <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </div>
  );
};