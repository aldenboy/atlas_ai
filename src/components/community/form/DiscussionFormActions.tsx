import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DiscussionFormActionsProps {
  isSubmitting: boolean;
  onClose: () => void;
}

export const DiscussionFormActions = ({ isSubmitting, onClose }: DiscussionFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        type="button"
        variant="ghost"
        onClick={onClose}
        disabled={isSubmitting}
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Discussion"}
      </Button>
    </div>
  );
};