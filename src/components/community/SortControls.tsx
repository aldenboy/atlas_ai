import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Star } from "lucide-react";

type SortOption = "trending" | "new" | "top";

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls = ({ sortBy, onSortChange }: SortControlsProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={sortBy === "trending" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onSortChange("trending")}
        className="text-sm"
      >
        <TrendingUp className="w-4 h-4 mr-1" />
        Trending
      </Button>
      <Button
        variant={sortBy === "new" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onSortChange("new")}
        className="text-sm"
      >
        <Clock className="w-4 h-4 mr-1" />
        New
      </Button>
      <Button
        variant={sortBy === "top" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onSortChange("top")}
        className="text-sm"
      >
        <Star className="w-4 h-4 mr-1" />
        Top
      </Button>
    </div>
  );
};