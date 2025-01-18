import React, { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';

type NewsItem = {
  id: number;
  text: string;
  category: 'market' | 'economy' | 'company';
};

// Mock API function - in a real app, this would fetch from a real news API
const fetchLatestNews = (): NewsItem[] => {
  const timestamp = new Date().toLocaleTimeString();
  return [
    { id: 1, text: `Fed signals potential rate cuts in 2024 (Updated ${timestamp})`, category: 'economy' },
    { id: 2, text: `Apple announces new AI initiatives (Updated ${timestamp})`, category: 'company' },
    { id: 3, text: `Bitcoin surges past key resistance level (Updated ${timestamp})`, category: 'market' },
    { id: 4, text: `S&P 500 reaches new all-time high (Updated ${timestamp})`, category: 'market' },
    { id: 5, text: `ECB maintains current monetary policy (Updated ${timestamp})`, category: 'economy' },
    { id: 6, text: `Tesla expands operations in Asia (Updated ${timestamp})`, category: 'company' },
  ];
};

export const NewsTickerTape = () => {
  const [news, setNews] = useState<NewsItem[]>(fetchLatestNews());

  useEffect(() => {
    // Update news every 30 seconds
    const interval = setInterval(() => {
      setNews(fetchLatestNews());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-purple-900/50 border-b border-purple-500/20 overflow-hidden">
      <div className="animate-[scroll_30s_linear_infinite] whitespace-nowrap inline-block">
        {[...news, ...news].map((item, index) => (
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