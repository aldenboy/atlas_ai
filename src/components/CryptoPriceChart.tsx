import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card } from "@/components/ui/card";

interface PriceData {
  timestamp: number;
  price: number;
}

const fetchCryptoData = async (symbol: string = 'bitcoin') => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=1&interval=hourly`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  
  const data = await response.json();
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));
};

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const CryptoPriceChart = ({ symbol = 'bitcoin' }: { symbol?: string }) => {
  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['crypto-chart', symbol],
    queryFn: () => fetchCryptoData(symbol),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="h-[400px] flex items-center justify-center">
          Loading chart data...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
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
    <Card className="p-4">
      <div className="h-[400px]">
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                className="text-muted-foreground"
              />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                className="text-muted-foreground"
              />
              <ChartTooltip
                content={({ active, payload }) => {
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
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-price)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};