import { CommentItem } from "./CommentItem";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
}

interface CommentListProps {
  comments: Comment[];
  onCommentUpdate: () => void;
}

export const CommentList = ({ comments, onCommentUpdate }: CommentListProps) => {
  const { toast } = useToast();

  const handleLike = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("discussion_comments")
        .update({ likes: comments.find(c => c.id === commentId)!.likes + 1 })
        .eq("id", commentId);

      if (error) throw error;
      onCommentUpdate();
    } catch (error) {
      console.error("Error liking comment:", error);
      toast({
        title: "Error",
        description: "Failed to like comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!comments.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onLike={() => handleLike(comment.id)}
        />
      ))}
    </div>
  );
};