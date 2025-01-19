import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const fallbackArticles = {
  articles: [
    {
      url: '1',
      title: 'Bitcoin Reaches New Milestone in Market Adoption',
    },
    {
      url: '2',
      title: 'Global Markets Show Strong Recovery Signs',
    },
    {
      url: '3',
      title: 'Major Tech Companies Embrace Blockchain Technology',
    },
    {
      url: '4',
      title: 'DeFi Protocols See Surge in Total Value Locked',
    },
    {
      url: '5',
      title: 'New Regulatory Framework Proposed for Digital Assets',
    }
  ]
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
      return new Response(
        JSON.stringify(fallbackArticles),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        },
      );
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
      console.error('NewsAPI error:', await response.text());
      return new Response(
        JSON.stringify(fallbackArticles),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        },
      );
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
      JSON.stringify(fallbackArticles),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    );
  }
});