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
    console.log('Fetching news from NewsAPI...');
    const apiKey = Deno.env.get('NEWS_API_KEY');
    
    if (!apiKey) {
      console.error('NEWS_API_KEY not found in environment variables');
      throw new Error('API key not configured');
    }

    const response = await fetch(
      'https://newsapi.org/v2/top-headlines?country=us&category=business',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewsAPI error:', errorText);
      throw new Error(`NewsAPI returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched news articles');

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    );
  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      },
    );
  }
});