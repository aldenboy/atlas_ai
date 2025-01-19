import { Button } from "@/components/ui/button";
import { MessageSquare, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DiscussionActionsProps {
  commentCount: number;
  onCommentClick: () => void;
}

export const DiscussionActions = ({ commentCount, onCommentClick }: DiscussionActionsProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Discussion link copied to clipboard",
    });
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs text-muted-foreground hover:text-primary"
        onClick={onCommentClick}
      >
        <MessageSquare className="w-4 h-4 mr-1" />
        {commentCount} Comments
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs text-muted-foreground hover:text-primary"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4 mr-1" />
        Share
      </Button>
    </div>
  );
};