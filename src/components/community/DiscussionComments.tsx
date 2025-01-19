import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { formatDistance } from "date-fns";
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="min-h-[100px] bg-background/50 focus:bg-background text-left"
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Posting..." : "Comment"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="group text-left">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1 text-left">
                  {formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })}
                </div>
                <p className="text-sm text-left">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <Button variant="ghost" size="sm" className="h-auto py-1 px-2 hover:text-primary">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    <span>{comment.likes || 0}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto py-1 px-2 hover:text-primary">
                    <ThumbsDown className="w-3 h-3 mr-1" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto py-1 px-2 hover:text-primary">
                    <Reply className="w-3 h-3 mr-1" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};