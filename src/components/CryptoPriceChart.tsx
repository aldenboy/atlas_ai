import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { fetchCryptoData, formatTime } from "@/utils/cryptoData";
import { ChartTooltipContent } from "./chart/ChartTooltipContent";
import { NeonGlowFilter } from "./chart/NeonGlowFilter";

export const CryptoPriceChart = ({ symbol = 'bitcoin' }: { symbol?: string }) => {
  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['crypto-chart', symbol],
    queryFn: () => fetchCryptoData(symbol),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <Card className="p-4 mb-12 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
        <div className="h-[400px] flex items-center justify-center">
          Loading chart data...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 mb-12 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
        <div className="h-[400px] flex items-center justify-center text-red-500">
          Error loading chart data
        </div>
      </Card>
    );
  }

  const config = {
    price: {
      label: 'Price',
      theme: {
        light: '#7c3aed',
        dark: '#a78bfa',
      },
    },
  };

  return (
    <Card className="p-4 mb-12 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
      <div className="h-[400px] w-full">
        <NeonGlowFilter />
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={priceData}
              margin={{ top: 10, right: 30, left: 60, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                className="text-muted-foreground"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                className="text-muted-foreground"
                width={80}
              />
              <Tooltip content={ChartTooltipContent} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
                style={{ filter: 'url(#neon-glow)' }}
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};