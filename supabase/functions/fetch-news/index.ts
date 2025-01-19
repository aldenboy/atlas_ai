import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('NEWS_API_KEY');
    
    if (!apiKey) {
      console.error('NEWS_API_KEY not found in environment variables');
      throw new Error('API key not configured');
    }

    console.log('Fetching news from NewsAPI...');
    
    const response = await fetch(
      'https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=10',
      {
        headers: {
          'X-Api-Key': apiKey
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewsAPI error:', response.status, errorText);
      throw new Error(`NewsAPI returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      console.error('Invalid response format from NewsAPI:', data);
      throw new Error('Invalid response format from NewsAPI');
    }

    console.log(`Successfully fetched ${data.articles.length} news articles`);

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200 
      },
    );

  } catch (error) {
    console.error('Error in fetch-news function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to fetch news data'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500
      },
    );
  }
});