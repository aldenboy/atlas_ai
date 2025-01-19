import React from 'react';
import { Newspaper } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type NewsItem = {
  id: string;
  text: string;
  category: 'market' | 'economy' | 'company';
};

// Fallback news data in case the API fails
const fallbackNews: NewsItem[] = [
  {
    id: '1',
    text: 'Bitcoin Reaches New Milestone in Market Adoption',
    category: 'market'
  },
  {
    id: '2',
    text: 'Global Markets Show Strong Recovery Signs',
    category: 'economy'
  },
  {
    id: '3',
    text: 'Major Tech Companies Embrace Blockchain Technology',
    category: 'company'
  },
  {
    id: '4',
    text: 'DeFi Protocols See Surge in Total Value Locked',
    category: 'market'
  },
  {
    id: '5',
    text: 'New Regulatory Framework Proposed for Digital Assets',
    category: 'economy'
  }
];

const fetchNews = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-news');
    
    if (error) {
      console.error('Supabase function error:', error);
      return fallbackNews;
    }

    return (data?.articles || []).slice(0, 6).map((article: any) => ({
      id: article.url,
      text: article.title,
      category: 'market' as const
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return fallbackNews;
  }
};

export const NewsTickerTape = () => {
  const { data: news, error, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    refetchInterval: 900000, // Refresh every 15 minutes instead of 5 to avoid rate limits
    retry: 1,
    initialData: fallbackNews
  });

  if (error) {
    console.error('Error fetching news:', error);
  }

  const newsItems = news || fallbackNews;

  if (isLoading) {
    return (
      <div className="w-full bg-purple-900/50 border-b border-purple-500/20 p-2">
        <div className="text-white/50">Loading news...</div>
      </div>
    );
  }

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