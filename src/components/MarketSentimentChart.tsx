import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { ChartSkeleton } from "./chart/ChartSkeleton";
import { ChartError } from "./chart/ChartError";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "./ui/use-toast";

interface SentimentData {
  created_at: string;
  sentiment_score: number;
}

const fetchSentimentData = async () => {
  const { data, error } = await supabase
    .from('market_sentiment')
    .select('created_at, sentiment_score')
    .order('created_at', { ascending: true })
    .limit(24);

  if (error) throw error;
  return data;
};

export const MarketSentimentChart = () => {
  const { toast } = useToast();
  
  const { data: sentimentData, isLoading, error } = useQuery({
    queryKey: ['market-sentiment'],
    queryFn: fetchSentimentData,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 60000,
    retry: 3,
    meta: {
      onError: () => {
        toast({
          title: "Error loading sentiment data",
          description: "Unable to fetch the latest market sentiment data. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error || !sentimentData) {
    console.error('Chart error:', error);
    return <ChartError />;
  }

  const config = {
    sentiment: {
      label: 'Market Sentiment',
      theme: {
        light: '#646cff',
        dark: '#646cff'
      }
    }
  };

  return (
    <Card className="p-6 rounded-xl bg-black/30 backdrop-blur-md border border-purple-500/20 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Market Sentiment Index</h3>
        <p className="text-sm text-muted-foreground">Fear vs Greed</p>
      </div>
      <div className="h-[300px]">
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
              <XAxis 
                dataKey="created_at"
                tickFormatter={(timestamp) => formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                className="text-muted-foreground"
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}`}
                className="text-muted-foreground"
                label={{ 
                  value: 'Sentiment Score', 
                  angle: -90, 
                  position: 'insideLeft',
                  className: "text-muted-foreground"
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const score = payload[0].value as number;
                    let sentiment = "Neutral";
                    if (score >= 75) sentiment = "Extreme Greed";
                    else if (score >= 60) sentiment = "Greed";
                    else if (score >= 45) sentiment = "Neutral";
                    else if (score >= 25) sentiment = "Fear";
                    else sentiment = "Extreme Fear";
                    
                    return (
                      <div className="bg-background/95 p-2 rounded-lg border border-border shadow-lg">
                        <p className="text-sm font-medium">{sentiment}</p>
                        <p className="text-sm text-muted-foreground">Score: {score}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="sentiment_score"
                stroke="url(#sentiment-gradient)"
                strokeWidth={2}
                dot={false}
              />
              <defs>
                <linearGradient id="sentiment-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};