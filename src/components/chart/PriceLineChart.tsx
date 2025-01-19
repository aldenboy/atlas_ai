import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartTooltipContent } from "./ChartTooltipContent";
import { formatTime } from "@/utils/cryptoData";
import { PriceData } from "@/utils/cryptoData";
import { ChartConfig } from "./ChartConfig";

interface PriceLineChartProps {
  data: PriceData[];
  symbol: string;
  config: ChartConfig;
}

export const PriceLineChart = ({ data, symbol, config }: PriceLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTime}
          className="text-muted-foreground"
          label={{ 
            value: 'Time', 
            position: 'bottom',
            offset: 0,
            className: "text-muted-foreground"
          }}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          className="text-muted-foreground"
          label={{ 
            value: 'BTC Dominance (%)', 
            angle: -90, 
            position: 'left',
            offset: 10,
            className: "text-muted-foreground"
          }}
        />
        <Tooltip content={ChartTooltipContent} />
        <Legend />
        <Line
          name="Bitcoin Dominance"
          type="monotone"
          dataKey="dominance"
          stroke={`var(--color-${Object.keys(config)[0]})`}
          strokeWidth={2}
          dot={false}
          style={{ filter: 'url(#neon-glow)' }}
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};