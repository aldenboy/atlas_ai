import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Clock, Star, ArrowRight } from "lucide-react";
import { DiscussionThread } from "./DiscussionThread";
import { NewDiscussionForm } from "./NewDiscussionForm";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type SortOption = "trending" | "new" | "top";

interface DiscussionForumProps {
  showAllTopics?: boolean;
}

export const DiscussionForum = ({ showAllTopics = false }: DiscussionForumProps) => {
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const isMobile = useIsMobile();

  const { data: discussions, isLoading } = useQuery({
    queryKey: ["discussions", sortBy],
    queryFn: async () => {
      let query = supabase
        .from("discussions")
        .select(`
          *,
          discussion_comments (count)
        `);

      switch (sortBy) {
        case "new":
          query = query.order("created_at", { ascending: false });
          break;
        case "top":
          query = query.order("likes", { ascending: false });
          break;
        case "trending":
        default:
          query = query.order("created_at", { ascending: false }).order("likes", { ascending: false });
          break;
      }

      if (!showAllTopics) {
        query = query.limit(3);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching discussions:", error);
        throw error;
      }
      return data;
    }
  });

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className={`flex flex-row items-center justify-between ${isMobile ? 'px-2 py-3' : 'px-0'}`}>
        <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Community</CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowNewDiscussion(true)} 
            size={isMobile ? "sm" : "default"}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
            {isMobile ? "New" : "New Discussion"}
          </Button>
          {!showAllTopics && (
            <Button asChild size={isMobile ? "sm" : "default"} variant="outline">
              <Link to="/community">
                {isMobile ? "All" : "View All"}
                <ArrowRight className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ml-2`} />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-2' : 'px-0'}`}>
        {showAllTopics && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={sortBy === "trending" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("trending")}
              className={`text-sm whitespace-nowrap ${isMobile ? 'px-2' : ''}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </Button>
            <Button
              variant={sortBy === "new" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("new")}
              className={`text-sm whitespace-nowrap ${isMobile ? 'px-2' : ''}`}
            >
              <Clock className="w-4 h-4 mr-1" />
              New
            </Button>
            <Button
              variant={sortBy === "top" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("top")}
              className={`text-sm whitespace-nowrap ${isMobile ? 'px-2' : ''}`}
            >
              <Star className="w-4 h-4 mr-1" />
              Top
            </Button>
          </div>
        )}

        <div className="space-y-3">
          {discussions?.map((discussion) => (
            <DiscussionThread key={discussion.id} discussion={discussion} />
          ))}
          {discussions?.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg">No discussions yet</p>
              <p className="text-sm">Be the first to start a discussion!</p>
            </div>
          )}
        </div>
        
        {showNewDiscussion && (
          <NewDiscussionForm onClose={() => setShowNewDiscussion(false)} />
        )}
      </CardContent>
    </Card>
  );
};