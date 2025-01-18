import React, { useEffect, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

type TickerItem = {
  symbol: string;
  price: number;
  change: number;
  type: 'stock' | 'crypto';
};

export const TickerTape = () => {
  // Mock data - in a real app, this would come from an API
  const [tickers] = useState<TickerItem[]>([
    { symbol: 'BTC/USD', price: 43250.20, change: 2.5, type: 'crypto' },
    { symbol: 'ETH/USD', price: 2280.15, change: -1.2, type: 'crypto' },
    { symbol: 'AAPL', price: 185.92, change: 0.8, type: 'stock' },
    { symbol: 'MSFT', price: 375.28, change: 1.5, type: 'stock' },
    { symbol: 'GOOGL', price: 142.65, change: -0.5, type: 'stock' },
    { symbol: 'SOL/USD', price: 98.45, change: 5.2, type: 'crypto' },
    { symbol: 'TSLA', price: 238.45, change: -2.1, type: 'stock' },
    { symbol: 'XRP/USD', price: 0.62, change: 1.8, type: 'crypto' },
  ]);

  return (
    <div className="w-full bg-black/50 border-t border-purple-500/20 overflow-hidden">
      <div className="animate-[scroll_20s_linear_infinite] whitespace-nowrap inline-block">
        {[...tickers, ...tickers].map((ticker, index) => (
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
              {Math.abs(ticker.change)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};