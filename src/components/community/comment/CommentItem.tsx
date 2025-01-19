import { formatDistance } from "date-fns";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentItemProps {
  comment: {
    content: string;
    created_at: string;
    user_id: string;
    likes: number;
  };
  onLike: () => void;
}

export const CommentItem = ({ comment, onLike }: CommentItemProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            User {comment.user_id.slice(0, 8)} •{" "}
            {formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })}
          </p>
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onLike}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          {comment.likes}
        </Button>
      </div>
    </div>
  );
};