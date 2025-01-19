import { DiscussionThread } from "./DiscussionThread";
import type { Discussion } from "./DiscussionThread";

interface DiscussionListProps {
  discussions: Discussion[];
  isLoading: boolean;
}

export const DiscussionList = ({ discussions, isLoading }: DiscussionListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">Loading discussions...</p>
      </div>
    );
  }

  if (!discussions || discussions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-lg">No discussions yet</p>
        <p className="text-sm">Be the first to start a discussion!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <DiscussionThread key={discussion.id} discussion={discussion} />
      ))}
    </div>
  );
};