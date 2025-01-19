import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ShillMeButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const ShillMeButton = ({ onClick, disabled }: ShillMeButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-200"
    >
      <Sparkles className="w-4 h-4 mr-2" />
      Shill Me!
    </Button>
  );
};