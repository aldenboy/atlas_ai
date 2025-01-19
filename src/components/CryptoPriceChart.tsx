import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import { fetchCryptoData, formatTime } from "@/utils/cryptoData";
import { ChartTooltipContent } from "./chart/ChartTooltipContent";
import { NeonGlowFilter } from "./chart/NeonGlowFilter";
import { useEffect } from "react";

export const CryptoPriceChart = ({ symbol = 'bitcoin' }: { symbol?: string }) => {
  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['crypto-chart', symbol],
    queryFn: () => fetchCryptoData(symbol),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <Card className="p-4 mb-8 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
        <div className="h-[300px] flex items-center justify-center">
          Loading chart data...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 mb-8 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
        <div className="h-[300px] flex items-center justify-center text-red-500">
          Error loading chart data
        </div>
      </Card>
    );
  }

  const config = {
    price: {
      label: `${symbol.charAt(0).toUpperCase() + symbol.slice(1)} Price (USD)`,
      theme: {
        light: '#7c3aed',
        dark: '#a78bfa',
      },
    },
  };

  return (
    <Card className="p-4 mb-16 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
      <div className="h-[300px]">
        <NeonGlowFilter />
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceData}
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
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                className="text-muted-foreground"
                label={{ 
                  value: 'Price (USD)', 
                  angle: -90, 
                  position: 'left',
                  offset: 10,
                  className: "text-muted-foreground"
                }}
              />
              <Tooltip content={ChartTooltipContent} />
              <Legend />
              <Line
                name={`${symbol.charAt(0).toUpperCase() + symbol.slice(1)} Price`}
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