import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const systemPrompt = `You are ATLAS (Automated Trading and Learning Analysis System), a sophisticated AI trading companion. Your role is to:

1. Analyze market trends and provide insights
2. Help users understand trading concepts
3. Provide real-time market analysis
4. Explain trading strategies
5. Offer risk management advice
6. Stay updated on market news

Your personality traits:
- Professional but approachable
- Data-driven in your analysis
- Risk-aware and conservative in recommendations
- Educational in your approach
- Clear and concise in communication
- Always remind users to do their own research

Never provide specific financial advice or make direct trading recommendations. Instead, focus on education and analysis.`;

// Simple rate limiting implementation
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const clientRequests = requestLog.get(clientId) || [];
  const recentRequests = clientRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  requestLog.set(clientId, recentRequests);
  return recentRequests.length >= MAX_REQUESTS_PER_WINDOW;
}

function logRequest(clientId: string) {
  const requests = requestLog.get(clientId) || [];
  requests.push(Date.now());
  requestLog.set(clientId, requests);
}

serve(async (req) => {
  // Always handle CORS preflight requests first
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = req.headers.get('x-client-info') || 'anonymous';
    
    // Check rate limit
    if (isRateLimited(clientId)) {
      console.error('Rate limit exceeded for client:', clientId);
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.',
          isRateLimit: true
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { message, currentTicker } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error. Please contact support.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let userPrompt = message;
    if (currentTicker) {
      userPrompt = `[Current Asset: ${currentTicker}] ${message}`;
    }

    console.log('Sending request to OpenAI with prompt:', userPrompt);
    
    // Log the request
    logRequest(clientId);

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
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      
      let errorMessage = 'Failed to generate response';
      if (error.error?.message?.includes('exceeded your current quota')) {
        errorMessage = 'Service is temporarily unavailable. Please try again in a few minutes.';
      } else if (error.error?.message?.includes('invalid_api_key')) {
        errorMessage = 'Service configuration error. Please contact support.';
      } else {
        errorMessage = error.error?.message || errorMessage;
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('Received response from OpenAI');
    
    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in chat-with-atlas function:', error);
    
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again.',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});