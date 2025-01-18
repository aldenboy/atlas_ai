import React from 'react';
import { Newspaper } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type NewsItem = {
  id: string;
  text: string;
  category: 'market' | 'economy' | 'company';
};

const fetchNews = async () => {
  const { data, error } = await supabase.functions.invoke('fetch-news');
  
  if (error) {
    throw error;
  }

  return data.articles.slice(0, 6).map((article: any) => ({
    id: article.url,
    text: article.title,
    category: 'market' as const
  }));
};

export const NewsTickerTape = () => {
  const { data: news, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (error) {
    console.error('Error fetching news:', error);
  }

  const newsItems = news || [];

  return (
    <div className="w-full bg-purple-900/50 border-b border-purple-500/20 overflow-hidden">
      <div className="animate-[scroll_30s_linear_infinite] whitespace-nowrap inline-block">
        {[...newsItems, ...newsItems].map((item, index) => (
          <div key={index} className="inline-block px-4 py-2">
            <span className="inline-flex items-center">
              <Newspaper className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-white/90 font-medium">BREAKING:</span>
              <span className="ml-2 text-white/80">{item.text}</span>
            </span>
            <span className="mx-8 text-purple-400/50">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};