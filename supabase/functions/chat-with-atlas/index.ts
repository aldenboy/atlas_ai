import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const systemPrompt = `You are ATLAS (Automated Trading and Learning Analysis System), a sophisticated AI trading companion. When a user enters a ticker, you should:

1. Acknowledge their ticker selection
2. Provide a brief market overview for that asset
3. Share the following information in a structured format:
   - Latest News: Recent significant developments
   - Major Transactions: Notable buys/sells in the last 24h
   - Token Metrics: Upcoming unlocks, vesting schedules if applicable
   - Social Sentiment: Recent mentions by Key Opinion Leaders (KOLs)
4. Include relevant links when available
5. Ask if they'd like to know more about any specific aspect

Remember to:
- Stay professional but approachable
- Be data-driven in your analysis
- Focus on education rather than direct advice
- Always remind users to DYOR (Do Their Own Research)
- Format responses clearly with sections and bullet points`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchNewsData(ticker: string) {
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

async function callOpenAI(prompt: string, context: string = ''): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  console.log('Calling OpenAI API with prompt:', prompt);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: context ? `${context}\n${prompt}` : prompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, currentTicker } = await req.json();
    console.log('Processing request for:', { message, currentTicker });

    // If this is a new ticker being set
    if (message.includes(currentTicker) && message.toLowerCase().includes('selected')) {
      // Fetch relevant news
      const newsArticles = await fetchNewsData(currentTicker);
      const newsContext = newsArticles.length > 0 
        ? `Recent news for ${currentTicker}:\n` + 
          newsArticles.map((article: any) => 
            `- ${article.title} (${article.url})`
          ).join('\n')
        : '';

      const prompt = `
A user has selected ${currentTicker} as their asset of interest. 
${newsContext}

Please provide:
1. A brief acknowledgment
2. Latest news summary (using the provided articles if available)
3. Any known major transactions
4. Token metrics and upcoming events if applicable
5. Recent KOL mentions or social sentiment
6. Ask what specific aspect they'd like to know more about

Format the response clearly with sections and include any relevant links.`;

      const response = await callOpenAI(prompt);
      console.log('Successfully generated response');

      return new Response(
        JSON.stringify({ response }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For follow-up questions
    const response = await callOpenAI(message, `Current asset being discussed: ${currentTicker}`);
    
    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-with-atlas function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});