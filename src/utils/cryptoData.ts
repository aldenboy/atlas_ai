export interface PriceData {
  timestamp: number;
  dominance: number;
}

export const fetchCryptoData = async (symbol: string = 'bitcoin') => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/global/bitcoin/dominance?days=1`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  
  const data = await response.json();
  return data.dominance_chart.map(([timestamp, dominance]: [number, number]) => ({
    timestamp,
    dominance,
  }));
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};