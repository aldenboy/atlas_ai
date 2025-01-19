import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ForumHeaderProps {
  showAllTopics: boolean;
  onNewDiscussion: () => void;
}

export const ForumHeader = ({ showAllTopics, onNewDiscussion }: ForumHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between px-0 pt-0">
      <CardTitle className="text-2xl font-bold">Community</CardTitle>
      <div className="flex gap-2">
        <Button onClick={onNewDiscussion} size="sm" className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
        {!showAllTopics && (
          <Button asChild size="sm" variant="outline">
            <Link to="/community">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </div>
    </CardHeader>
  );
};