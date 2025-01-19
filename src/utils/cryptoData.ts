export interface PriceData {
  timestamp: number;
  price: number;
}

export const fetchCryptoData = async (symbol: string = 'bitcoin') => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=1`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch crypto data');
  }
  
  const data = await response.json();
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};