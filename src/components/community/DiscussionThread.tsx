import { useState } from "react";
import { formatDistance } from "date-fns";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  created_at: string;
  discussion_comments: { count: number }[];
}

export const DiscussionThread = ({ discussion }: { discussion: Discussion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{discussion.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistance(new Date(discussion.created_at), new Date(), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{discussion.discussion_comments[0]?.count || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{discussion.likes}</span>
            </Button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4">
            <p className="text-sm">{discussion.content}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {discussion.category}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};