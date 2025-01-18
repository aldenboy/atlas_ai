import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { formatDistance } from "date-fns";
import { TradeComments } from "./TradeComments";

interface Trade {
  id: string;
  symbol: string;
  entry_price: number;
  exit_price: number | null;
  position_size: number;
  strategy: string | null;
  notes: string | null;
  trade_date: string;
}

export const TradingJournalEntry = ({ trade }: { trade: Trade }) => {
  const [showComments, setShowComments] = useState(false);
  
  const pnl = trade.exit_price 
    ? (trade.exit_price - trade.entry_price) * trade.position_size 
    : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{trade.symbol}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistance(new Date(trade.trade_date), new Date(), { addSuffix: true })}
            </p>
          </div>
          {pnl !== null && (
            <span className={`font-semibold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <div>Entry: ${trade.entry_price}</div>
          <div>Exit: {trade.exit_price ? `$${trade.exit_price}` : 'Open'}</div>
          <div>Size: {trade.position_size}</div>
          {trade.strategy && <div>Strategy: {trade.strategy}</div>}
        </div>
        {trade.notes && (
          <p className="mt-2 text-sm text-muted-foreground">{trade.notes}</p>
        )}
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showComments ? "Hide Comments" : "Show Comments"}</span>
          </Button>
        </div>
        {showComments && (
          <TradeComments tradeId={trade.id} />
        )}
      </CardContent>
    </Card>
  );
};