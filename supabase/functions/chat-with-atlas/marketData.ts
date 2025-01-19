const tickerToGeckoId: { [key: string]: string } = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'XRP': 'ripple',
  'DOGE': 'dogecoin',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  // Add more common mappings
};

export const formatNumber = (num: number) => {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else {
    return `$${num.toLocaleString()}`;
  }
};

export async function fetchTokenData(ticker: string) {
  try {
    // First try the mapping
    let geckoId = tickerToGeckoId[ticker.toUpperCase()];
    
    if (!geckoId) {
      // If not in mapping, try to search for the token
      const searchResponse = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${ticker}`
      );
      
      if (!searchResponse.ok) {
        console.error('CoinGecko search API error:', await searchResponse.text());
        return null;
      }

      const searchData = await searchResponse.json();
      if (searchData.coins && searchData.coins.length > 0) {
        geckoId = searchData.coins[0].id;
      } else {
        console.error('No matching token found for:', ticker);
        return null;
      }
    }

    console.log('Fetching data for CoinGecko ID:', geckoId);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
    );
    
    if (!response.ok) {
      console.error('CoinGecko API error:', await response.text());
      return null;
    }

    const data = await response.json();
    console.log('CoinGecko response:', data);
    
    const tokenData = data[geckoId];
    if (!tokenData) {
      console.error('No data found for token:', geckoId);
      return null;
    }
    
    return {
      currentPrice: tokenData.usd || 'N/A',
      marketCap: tokenData.usd_market_cap || 'N/A',
      volume24h: tokenData.usd_24h_vol || 'N/A',
      priceChange24h: tokenData.usd_24h_change || 'N/A'
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    return null;
  }
}

export async function fetchNewsData(ticker: string) {
  try {
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${ticker}&sortBy=publishedAt&pageSize=3&apiKey=${newsApiKey}`
    );
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}