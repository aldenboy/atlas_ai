import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Discussion } from "@/components/community/DiscussionThread";

type SortOption = "trending" | "new" | "top";

export const useDiscussions = (sortBy: SortOption, limit?: number) => {
  return useQuery({
    queryKey: ["discussions", sortBy, limit],
    queryFn: async () => {
      console.log("Fetching discussions with sort:", sortBy);
      
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
          query = query.order("created_at", { ascending: false });
          break;
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching discussions:", error);
        throw error;
      }
      
      // Transform the data to match the Discussion type
      const discussions = data.map(item => ({
        ...item,
        user: { id: item.user_id }
      }));
      
      console.log("Fetched discussions:", discussions);
      return discussions as Discussion[];
    },
    refetchOnWindowFocus: false
  });
};