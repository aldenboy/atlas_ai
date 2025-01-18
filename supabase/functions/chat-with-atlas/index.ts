import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple rate limiting implementation
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const clientRequests = requestLog.get(clientId) || [];
  
  // Clean up old requests
  const recentRequests = clientRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  // Update request log
  requestLog.set(clientId, recentRequests);
  
  return recentRequests.length >= MAX_REQUESTS_PER_WINDOW;
}

function logRequest(clientId: string) {
  const requests = requestLog.get(clientId) || [];
  requests.push(Date.now());
  requestLog.set(clientId, requests);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = req.headers.get('x-client-info') || 'anonymous';
    
    // Check rate limit
    if (isRateLimited(clientId)) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
    }

    const { message, currentTicker } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
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
        model: 'gpt-4o-mini', // Using the more cost-effective model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      
      if (error.error?.message?.includes('exceeded your current quota')) {
        throw new Error('Service is temporarily unavailable. Please try again in a few minutes.');
      } else if (error.error?.message?.includes('invalid_api_key')) {
        throw new Error('Service configuration error. Please contact support.');
      } else {
        throw new Error(error.error?.message || 'Failed to generate response');
      }
    }

    const data = await response.json();
    console.log('Received response from OpenAI');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-atlas function:', error);
    
    // Determine if this is a rate limit error
    const isRateLimitError = error.message?.includes('Rate limit exceeded');
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString(),
        isRateLimit: isRateLimitError
      }), {
      status: isRateLimitError ? 429 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});