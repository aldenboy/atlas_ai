import React, { useEffect, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

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
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple&vs_currencies=usd&include_24hr_change=true'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  const data = await response.json();
  
  return [
    { symbol: 'BTC/USD', price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change, type: 'crypto' as const },
    { symbol: 'ETH/USD', price: data.ethereum.usd, change: data.ethereum.usd_24h_change, type: 'crypto' as const },
    { symbol: 'SOL/USD', price: data.solana.usd, change: data.solana.usd_24h_change, type: 'crypto' as const },
    { symbol: 'XRP/USD', price: data.ripple.usd, change: data.ripple.usd_24h_change, type: 'crypto' as const },
  ];
};

export const TickerTape = () => {
  const { data: cryptoData, error } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const allTickers = [...(cryptoData || []), ...stockData];

  if (error) {
    console.error('Error fetching crypto data:', error);
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