import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { ChartSkeleton } from "./chart/ChartSkeleton";
import { ChartError } from "./chart/ChartError";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "./ui/use-toast";

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
    refetchInterval: 300000, // Refresh every 5 minutes
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

  if (isLoading) {
    return <ChartSkeleton />;
  }

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
      {/* Animated Bubbles Background - Made larger and more visible */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-32 h-32 bg-primary/20 rounded-full -top-16 -left-16 animate-float blur-xl" />
        <div className="absolute w-40 h-40 bg-primary/15 rounded-full top-20 right-10 animate-float [animation-delay:1s] blur-xl" />
        <div className="absolute w-36 h-36 bg-primary/20 rounded-full bottom-10 left-10 animate-float [animation-delay:2s] blur-xl" />
        <div className="absolute w-48 h-48 bg-primary/15 rounded-full -bottom-20 -right-20 animate-float [animation-delay:3s] blur-xl" />
        
        {/* Additional bubbles for more dynamic effect */}
        <div className="absolute w-24 h-24 bg-primary/10 rounded-full top-1/3 left-1/4 animate-float [animation-delay:2.5s] blur-xl" />
        <div className="absolute w-28 h-28 bg-primary/25 rounded-full bottom-1/3 right-1/4 animate-float [animation-delay:1.5s] blur-xl" />
      </div>

      {/* Main Content - Enhanced glassmorphism effect */}
      <Card className="relative p-6 rounded-xl bg-black/40 backdrop-blur-xl border-0 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Bitcoin Dominance</h3>
          <p className="text-sm text-muted-foreground">Market Share %</p>
        </div>
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
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dominance = payload[0].value as number;
                      return (
                        <div className="bg-background/95 p-2 rounded-lg border border-border shadow-lg backdrop-blur-md">
                          <p className="text-sm font-medium">BTC Dominance</p>
                          <p className="text-sm text-muted-foreground">{dominance.toFixed(2)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
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