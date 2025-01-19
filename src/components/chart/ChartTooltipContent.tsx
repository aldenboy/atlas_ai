import { PriceData } from "@/utils/cryptoData";
import { formatTime } from "@/utils/cryptoData";

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
}

export const ChartTooltipContent = ({ active, payload }: ChartTooltipContentProps) => {
  if (!active || !payload?.length) return null;
  
  const data = payload[0].payload as PriceData;
  
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Time:</div>
        <div>{formatTime(data.timestamp)}</div>
        <div className="font-medium">Price:</div>
        <div>${data.price.toLocaleString()}</div>
      </div>
    </div>
  );
};