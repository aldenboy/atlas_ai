import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchTokenData, fetchNewsData, formatNumber } from './marketData.ts';
import { generateResearchPaper, saveResearchPaper } from './researchPaper.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are ATLAS (Automated Trading and Learning Analysis System), a sophisticated AI trading companion. Your responses should follow this structured format:

1. TOKEN INFORMATION (Always start with this section):
   - Project Name:
   - Token Ticker:
   - Website:
   - Contract Address:
   - Social Media Links:
   - Founder Information:
   - Launch Date:
   - Total Supply:
   - Circulating Supply:

2. MARKET ANALYSIS:
   - Current Price:
   - Market Cap:
   - 24h Volume:
   - Price Change (24h):
   - Key Price Levels:

3. PROJECT ANALYSIS:
   - Technology Overview:
   - Use Case:
   - Competitive Advantages:
   - Recent Developments:

4. RISK ASSESSMENT:
   - Technical Risks:
   - Market Risks:
   - Regulatory Concerns:
   - Competition Analysis:

5. SOCIAL METRICS:
   - Community Growth:
   - Social Media Engagement:
   - Developer Activity:
   - Notable Partnerships:

Remember to:
- Stay professional but approachable
- Be data-driven in your analysis
- Focus on education rather than direct advice
- Always remind users to DYOR (Do Their Own Research)
- Include relevant links when available
- Use the real-time market data provided`;

async function callOpenAI(prompt: string, context: string = '', marketData: any = null): Promise<{ response: string; paper?: string }> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  let enhancedPrompt = prompt;
  if (marketData) {
    enhancedPrompt += `\n\nCurrent Market Data:\n` +
      `- Price: $${Number(marketData.currentPrice).toLocaleString()}\n` +
      `- Market Cap: ${formatNumber(marketData.marketCap)}\n` +
      `- 24h Volume: ${formatNumber(marketData.volume24h)}\n` +
      `- 24h Price Change: ${marketData.priceChange24h.toFixed(2)}%`;
  }

  console.log('Calling OpenAI API with prompt:', enhancedPrompt);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: context ? `${context}\n${enhancedPrompt}` : enhancedPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    const analysisResponse = data.choices[0].message.content;

    if (prompt.includes('selected') || prompt.includes('shill me')) {
      const ticker = prompt.includes('selected') 
        ? prompt.match(/selected (.*?) as/)?.[1] 
        : analysisResponse.match(/Token Ticker: (.*?)[\n\r]/)?.[1];

      if (ticker) {
        const paperContent = await generateResearchPaper(ticker, analysisResponse);
        const paperUrl = await saveResearchPaper(ticker, paperContent);
        
        return {
          response: `${analysisResponse}\n\n📑 Detailed Research Paper: [Download PDF](${paperUrl})`,
          paper: paperUrl
        };
      }
    }

    return { response: analysisResponse };
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

    if (message.includes(currentTicker) && message.toLowerCase().includes('selected')) {
      const marketData = await fetchTokenData(currentTicker);
      console.log('Fetched market data:', marketData);

      if (!marketData) {
        return new Response(
          JSON.stringify({
            error: `Unable to fetch market data for ${currentTicker}. Please verify the ticker symbol.`
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const newsArticles = await fetchNewsData(currentTicker);
      const newsContext = newsArticles.length > 0 
        ? `Recent news for ${currentTicker}:\n` + 
          newsArticles.map((article: any) => 
            `- ${article.title} (${article.url})`
          ).join('\n')
        : '';

      const { response, paper } = await callOpenAI(message, newsContext, marketData);
      console.log('Successfully generated response and research paper');

      return new Response(
        JSON.stringify({ response, paper }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { response } = await callOpenAI(message, `Current asset being discussed: ${currentTicker}`);
    
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