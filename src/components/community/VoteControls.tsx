import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface VoteControlsProps {
  discussionId: string;
  initialLikes: number;
  onVote: (increment: number) => Promise<void>;
}

export const VoteControls = ({ discussionId, initialLikes, onVote }: VoteControlsProps) => {
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

      await onVote(increment);
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to register vote",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-auto"
        onClick={() => handleVote(1)}
      >
        <ThumbsUp className="w-4 h-4 text-muted-foreground hover:text-primary" />
      </Button>
      <span className="text-sm font-medium">{initialLikes}</span>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-auto"
        onClick={() => handleVote(-1)}
      >
        <ThumbsDown className="w-4 h-4 text-muted-foreground hover:text-primary" />
      </Button>
    </div>
  );
};