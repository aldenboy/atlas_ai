import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { fetchCryptoData } from "@/utils/cryptoData";
import { ChartSkeleton } from "./chart/ChartSkeleton";
import { ChartError } from "./chart/ChartError";
import { PriceLineChart } from "./chart/PriceLineChart";
import { NeonGlowFilter } from "./chart/NeonGlowFilter";
import { getChartConfig } from "./chart/ChartConfig";

export const CryptoPriceChart = ({ symbol = 'bitcoin' }: { symbol?: string }) => {
  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['crypto-chart', symbol],
    queryFn: () => fetchCryptoData(symbol),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return <ChartError />;
  }

  const config = getChartConfig(symbol);

  return (
    <Card className="p-6 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20">
      <div className="h-[300px]">
        <NeonGlowFilter />
        <ChartContainer config={config}>
          <PriceLineChart 
            data={priceData} 
            symbol={symbol}
            config={config}
          />
        </ChartContainer>
      </div>
    </Card>
  );
};