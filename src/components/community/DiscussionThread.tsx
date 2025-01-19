import { useState } from "react";
import { formatDistance } from "date-fns";
import { MessageSquare, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiscussionComments } from "./DiscussionComments";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  created_at: string;
  user_id: string;
  discussion_comments: { count: number }[];
}

export const DiscussionThread = ({ discussion }: { discussion: Discussion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localLikes, setLocalLikes] = useState(discussion.likes);
  const { toast } = useToast();

  const handleVote = async (increment: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to vote on discussions",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('discussions')
        .update({ likes: localLikes + increment })
        .eq('id', discussion.id);

      if (error) throw error;
      setLocalLikes(prev => prev + increment);
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Discussion link copied to clipboard",
    });
  };

  return (
    <Card className="hover:bg-accent/20 transition-colors border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Vote buttons column */}
          <div className="flex flex-col items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto"
              onClick={() => handleVote(1)}
            >
              <ThumbsUp className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </Button>
            <span className="text-sm font-medium">{localLikes}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto"
              onClick={() => handleVote(-1)}
            >
              <ThumbsDown className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </Button>
          </div>

          {/* Main content */}
          <div className="flex-1" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {discussion.category}
                </span>
                <span>•</span>
                <span>{formatDistance(new Date(discussion.created_at), new Date(), { addSuffix: true })}</span>
              </div>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                {discussion.title}
              </h3>
              {isExpanded && (
                <p className="text-sm mt-2 text-muted-foreground">
                  {discussion.content}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(!showComments);
                }}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                {discussion.discussion_comments[0]?.count || 0} Comments
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {showComments && isExpanded && (
          <div className="mt-4 ml-8 border-l-2 border-accent pl-4">
            <DiscussionComments discussionId={discussion.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};