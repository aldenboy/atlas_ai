export interface PriceData {
  timestamp: number;
  price: number;
}

export const fetchCryptoData = async (symbol: string = 'bitcoin') => {
  try {
    // Remove interval parameter and set days=2 to get hourly data automatically
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=2`,
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.prices || !Array.isArray(data.prices)) {
      throw new Error('Invalid data format received from API');
    }
    
    // Take only the last 24 data points to show last 24 hours
    const last24Hours = data.prices.slice(-24);
    
    return last24Hours.map(([timestamp, price]: [number, number]) => ({
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