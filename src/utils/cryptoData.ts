export interface PriceData {
  timestamp: number;
  price: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCryptoData = async (symbol: string = 'bitcoin') => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=2`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ATLAS Price Chart Widget'
        }
      }
    );
    
    if (response.status === 429) {
      // Rate limit hit - wait and retry
      await delay(1000);
      return fetchCryptoData(symbol);
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response from CoinGecko:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.prices || !Array.isArray(data.prices)) {
      console.error('Invalid data format received:', data);
      throw new Error('Invalid data format received from API');
    }
    
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};