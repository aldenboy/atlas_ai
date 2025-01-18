import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TradingJournalEntry } from "./TradingJournalEntry";
import { NewTradeForm } from "./NewTradeForm";

export const TradingJournal = () => {
  const [showNewTradeForm, setShowNewTradeForm] = useState(false);

  const { data: trades, isLoading } = useQuery({
    queryKey: ["tradingJournal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trading_journal")
        .select("*")
        .order("trade_date", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Trading Journal</CardTitle>
        <Button onClick={() => setShowNewTradeForm(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Trade
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trades?.map((trade) => (
            <TradingJournalEntry key={trade.id} trade={trade} />
          ))}
        </div>
        {showNewTradeForm && (
          <NewTradeForm onClose={() => setShowNewTradeForm(false)} />
        )}
      </CardContent>
    </Card>
  );
};