import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

type TickerItem = {
  symbol: string;
  price: number;
  change: number;
  type: 'stock' | 'crypto';
};

// Static stock data (since we're only implementing crypto API for now)
const stockData: TickerItem[] = [
  { symbol: 'AAPL', price: 185.92, change: 0.8, type: 'stock' },
  { symbol: 'MSFT', price: 375.28, change: 1.5, type: 'stock' },
  { symbol: 'GOOGL', price: 142.65, change: -0.5, type: 'stock' },
  { symbol: 'TSLA', price: 238.45, change: -2.1, type: 'stock' },
];

const fetchCryptoData = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('crypto-data', {
      body: { 
        endpoint: 'current-prices'
      }
    });
    
    if (error) throw error;
    
    return [
      { symbol: 'BTC/USD', price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change, type: 'crypto' as const },
      { symbol: 'ETH/USD', price: data.ethereum.usd, change: data.ethereum.usd_24h_change, type: 'crypto' as const },
      { symbol: 'SOL/USD', price: data.solana.usd, change: data.solana.usd_24h_change, type: 'crypto' as const },
      { symbol: 'XRP/USD', price: data.ripple.usd, change: data.ripple.usd_24h_change, type: 'crypto' as const },
    ];
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    // Return fallback crypto data if API fails
    return [
      { symbol: 'BTC/USD', price: 43000, change: 0.5, type: 'crypto' as const },
      { symbol: 'ETH/USD', price: 2300, change: 1.2, type: 'crypto' as const },
      { symbol: 'SOL/USD', price: 98, change: -0.8, type: 'crypto' as const },
      { symbol: 'XRP/USD', price: 0.62, change: 0.3, type: 'crypto' as const },
    ];
  }
};

export const TickerTape = () => {
  const { data: cryptoData, error, isLoading } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2,
    staleTime: 10000,
  });

  if (error) {
    console.error('Error fetching crypto data:', error);
  }

  const allTickers = [...(cryptoData || []), ...stockData];

  if (isLoading) {
    return (
      <div className="w-full bg-black/50 border-t border-purple-500/20 p-2">
        <div className="text-white/50">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black/50 border-t border-purple-500/20 overflow-hidden">
      <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap inline-block">
        {[...allTickers, ...allTickers].map((ticker, index) => (
          <div key={index} className="inline-block px-4 py-2">
            <span className="text-white/80">{ticker.symbol}</span>
            <span className="ml-2 text-white">
              ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`ml-2 flex items-center inline-flex ${
                ticker.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {ticker.change >= 0 ? (
                <ArrowUpIcon className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 mr-1" />
              )}
              {Math.abs(ticker.change).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};