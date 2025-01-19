import { useState } from "react";
import { formatDistance } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { VoteControls } from "./VoteControls";
import { DiscussionActions } from "./DiscussionActions";
import { DiscussionComments } from "./DiscussionComments";

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

  const handleVote = async (increment: number) => {
    const { error } = await supabase
      .from('discussions')
      .update({ likes: localLikes + increment })
      .eq('id', discussion.id);

    if (error) throw error;
    setLocalLikes(prev => prev + increment);
  };

  return (
    <Card className="hover:bg-accent/20 transition-colors border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <VoteControls
            discussionId={discussion.id}
            initialLikes={localLikes}
            onVote={handleVote}
          />

          <div className="flex-1" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {discussion.category}
                </span>
                <span>•</span>
                <span>
                  {formatDistance(new Date(discussion.created_at), new Date(), { addSuffix: true })}
                </span>
              </div>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors text-left">
                {discussion.title}
              </h3>
              {isExpanded && (
                <p className="text-sm mt-2 text-muted-foreground text-left">
                  {discussion.content}
                </p>
              )}
            </div>

            <DiscussionActions
              commentCount={discussion.discussion_comments[0]?.count || 0}
              onCommentClick={() => {
                setIsExpanded(true);
                setShowComments(!showComments);
              }}
            />
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