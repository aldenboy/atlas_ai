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

// Retry logic for OpenAI API calls
async function callOpenAIWithRetry(prompt: string, maxRetries = 3): Promise<Response> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} to call OpenAI API`);
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
            { role: 'user', content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        return response;
      }

      const error = await response.json();
      console.error(`OpenAI API Error (Attempt ${attempt + 1}):`, error);

      // Don't retry on these errors
      if (error.error?.type === 'invalid_request_error' ||
          error.error?.type === 'invalid_api_key') {
        throw new Error(error.error?.message || 'Invalid request configuration');
      }

      // Wait before retrying
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      lastError = error;
    } catch (error) {
      console.error(`Error during attempt ${attempt + 1}:`, error);
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(lastError?.error?.message || 'Service is temporarily unavailable after multiple retries');
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
    let userPrompt = message;
    if (currentTicker) {
      userPrompt = `[Current Asset: ${currentTicker}] ${message}`;
    }

    console.log('Sending request to OpenAI with prompt:', userPrompt);
    
    // Log the request
    logRequest(clientId);

    const response = await callOpenAIWithRetry(userPrompt);
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
    
    const errorMessage = error.message || 'An unexpected error occurred';
    const status = errorMessage.includes('rate limit') ? 429 : 500;
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error.toString()
      }),
      {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});