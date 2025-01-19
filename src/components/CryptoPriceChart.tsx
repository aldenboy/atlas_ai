import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { fetchCryptoData } from "@/utils/cryptoData";
import { ChartSkeleton } from "./chart/ChartSkeleton";
import { ChartError } from "./chart/ChartError";
import { PriceLineChart } from "./chart/PriceLineChart";
import { NeonGlowFilter } from "./chart/NeonGlowFilter";

export const CryptoPriceChart = () => {
  const { data: dominanceData, isLoading, error } = useQuery({
    queryKey: ['btc-dominance'],
    queryFn: () => fetchCryptoData(),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return <ChartError />;
  }

  const config = {
    dominance: {
      label: 'Bitcoin Dominance',
      theme: {
        light: '#646cff',
        dark: '#646cff'
      }
    }
  };

  return (
    <Card className="p-6 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20 h-full">
      <div className="h-[300px]">
        <NeonGlowFilter />
        <ChartContainer config={config}>
          <PriceLineChart 
            data={dominanceData} 
            symbol="bitcoin"
            config={config}
          />
        </ChartContainer>
      </div>
    </Card>
  );
};