import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { fetchCryptoData } from "@/utils/cryptoData";
import { ChartSkeleton } from "./chart/ChartSkeleton";
import { ChartError } from "./chart/ChartError";
import { PriceLineChart } from "./chart/PriceLineChart";
import { NeonGlowFilter } from "./chart/NeonGlowFilter";
import { useToast } from "@/components/ui/use-toast";

export const CryptoPriceChart = ({ symbol = 'bitcoin' }: { symbol?: string }) => {
  const { toast } = useToast();
  
  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['crypto-chart', symbol],
    queryFn: () => fetchCryptoData(symbol),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
    retry: 3,
    meta: {
      errorMessage: "Unable to fetch the latest price data. Please try again later."
    },
    onSettled: (data, error) => {
      if (error) {
        toast({
          title: "Error loading chart data",
          description: "Unable to fetch the latest price data. Please try again later.",
          variant: "destructive",
        });
        console.error('Chart error:', error);
      }
    }
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error || !priceData) {
    return <ChartError />;
  }

  const config = {
    price: {
      label: `${symbol.charAt(0).toUpperCase() + symbol.slice(1)} Price`,
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
            data={priceData} 
            symbol={symbol}
            config={config}
          />
        </ChartContainer>
      </div>
    </Card>
  );
};