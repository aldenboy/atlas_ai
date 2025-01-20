import { supabase } from "@/integrations/supabase/client";

export interface PriceData {
  timestamp: number;
  price: number;
}

export const fetchCryptoData = async (symbol: string = 'bitcoin') => {
  try {
    const { data, error } = await supabase.functions.invoke('crypto-data', {
      body: { endpoint: 'price-history', symbol }
    });
    
    if (error) {
      console.error('Error fetching crypto data:', error);
      throw error;
    }
    
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