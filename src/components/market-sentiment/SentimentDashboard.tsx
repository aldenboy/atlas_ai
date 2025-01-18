import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SentimentDashboard = () => {
  const { data: sentimentData, isLoading, error } = useQuery({
    queryKey: ["marketSentiment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("market_sentiment")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(10);
      
      if (error) {
        console.error("Error fetching sentiment data:", error);
        throw error;
      }

      return data?.map(item => ({
        ...item,
        created_at: new Date(item.created_at).toLocaleDateString(),
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading sentiment data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="symbol" 
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sentiment_score" 
                stroke="#8884d8" 
                name="Sentiment Score"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="news_sentiment" 
                stroke="#82ca9d" 
                name="News Sentiment"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};