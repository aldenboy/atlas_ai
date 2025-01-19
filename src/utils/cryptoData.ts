export interface PriceData {
  timestamp: number;
  dominance: number;
}

export const fetchCryptoData = async (symbol: string = 'bitcoin') => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/global'
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  
  const data = await response.json();
  const timestamp = Date.now();
  
  // For Bitcoin dominance, we'll return a single point since the global endpoint
  // only provides current dominance
  return [{
    timestamp,
    dominance: data.data.market_cap_percentage.btc
  }];
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};