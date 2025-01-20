import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { ChartSkeleton } from "./chart/ChartSkeleton";
import { ChartError } from "./chart/ChartError";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "./ui/use-toast";
import { AnimatedBubblesBackground } from "./chart/AnimatedBubblesBackground";
import { ChartHeader } from "./chart/ChartHeader";
import { DominanceTooltip } from "./chart/DominanceTooltip";

interface DominanceData {
  created_at: string;
  btc_dominance: number;
}

const fetchDominanceData = async () => {
  const { data, error } = await supabase
    .from('market_sentiment')
    .select('created_at, btc_dominance')
    .order('created_at', { ascending: true })
    .limit(24);

  if (error) throw error;
  return data;
};

export const MarketSentimentChart = () => {
  const { toast } = useToast();
  
  const { data: dominanceData, isLoading, error } = useQuery({
    queryKey: ['btc-dominance'],
    queryFn: fetchDominanceData,
    refetchInterval: 300000,
    staleTime: 60000,
    retry: 3,
    meta: {
      onError: () => {
        toast({
          title: "Error loading BTC dominance data",
          description: "Unable to fetch the latest BTC dominance data. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) return <ChartSkeleton />;
  if (error || !dominanceData) {
    console.error('Chart error:', error);
    return <ChartError />;
  }

  const config = {
    dominance: {
      label: 'BTC Dominance',
      theme: {
        light: '#F7931A',
        dark: '#F7931A'
      }
    }
  };

  return (
    <div className="relative">
      <AnimatedBubblesBackground />
      <Card className="relative p-6 rounded-xl bg-black/40 backdrop-blur-xl border-0 shadow-2xl">
        <ChartHeader 
          title="Bitcoin Dominance" 
          subtitle="Market Share %" 
        />
        <div className="h-[300px]">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dominanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                <XAxis 
                  dataKey="created_at"
                  tickFormatter={(timestamp) => formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                  className="text-muted-foreground"
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  className="text-muted-foreground"
                  label={{ 
                    value: 'Dominance %', 
                    angle: -90, 
                    position: 'insideLeft',
                    className: "text-muted-foreground"
                  }}
                />
                <Tooltip content={DominanceTooltip} />
                <Line
                  type="monotone"
                  dataKey="btc_dominance"
                  stroke="#F7931A"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};