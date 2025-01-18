import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const NewTradeForm = ({ onClose }: { onClose: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      symbol: String(formData.get("symbol")),
      entry_price: parseFloat(String(formData.get("entry_price"))),
      position_size: parseFloat(String(formData.get("position_size"))),
      strategy: String(formData.get("strategy")),
      notes: String(formData.get("notes")),
      user_id: (await supabase.auth.getUser()).data.user?.id
    };

    try {
      const { error } = await supabase
        .from("trading_journal")
        .insert(data);

      if (error) throw error;

      toast({
        title: "Trade Added",
        description: "Your trade has been successfully recorded.",
      });

      queryClient.invalidateQueries({ queryKey: ["tradingJournal"] });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add trade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input name="symbol" placeholder="Symbol (e.g., BTC)" required />
          </div>
          <div>
            <Input 
              name="entry_price" 
              type="number" 
              step="0.00000001"
              placeholder="Entry Price" 
              required 
            />
          </div>
          <div>
            <Input 
              name="position_size" 
              type="number" 
              step="0.00000001"
              placeholder="Position Size" 
              required 
            />
          </div>
          <div>
            <Input name="strategy" placeholder="Strategy (optional)" />
          </div>
          <div>
            <Textarea name="notes" placeholder="Notes (optional)" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Trade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};