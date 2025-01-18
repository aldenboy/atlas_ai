import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TradingJournalEntry } from "./TradingJournalEntry";
import { NewTradeForm } from "./NewTradeForm";
import { useToast } from "@/components/ui/use-toast";

export const TradingJournal = () => {
  const [showNewTradeForm, setShowNewTradeForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: trades, isLoading } = useQuery({
    queryKey: ["tradingJournal", userId],
    queryFn: async () => {
      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your trading journal.",
          variant: "destructive",
        });
        return [];
      }

      const { data, error } = await supabase
        .from("trading_journal")
        .select("*")
        .order("trade_date", { ascending: false });
      
      if (error) {
        console.error("Error fetching trades:", error);
        throw error;
      }
      return data;
    },
    enabled: !!userId
  });

  const handleAddTrade = () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add trades.",
        variant: "destructive",
      });
      return;
    }
    setShowNewTradeForm(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Trading Journal</CardTitle>
        <Button onClick={handleAddTrade} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Trade
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trades?.map((trade) => (
            <TradingJournalEntry key={trade.id} trade={trade} />
          ))}
          {!userId && (
            <div className="text-center py-4 text-muted-foreground">
              Please log in to view your trading journal
            </div>
          )}
          {userId && trades?.length === 0 && !isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              No trades recorded yet
            </div>
          )}
        </div>
        {showNewTradeForm && (
          <NewTradeForm onClose={() => setShowNewTradeForm(false)} />
        )}
      </CardContent>
    </Card>
  );
};