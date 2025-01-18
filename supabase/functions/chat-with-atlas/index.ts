import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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

async function callOpenAI(prompt: string): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  console.log('Calling OpenAI API with prompt:', prompt);
  
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

  if (!response.ok) {
    const error = await response.json();
    console.error('OpenAI API Error:', error);
    throw new Error(error.error?.message || 'Failed to get response from OpenAI');
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    console.error('Unexpected OpenAI response format:', data);
    throw new Error('Invalid response format from OpenAI');
  }

  return data.choices[0].message.content;
}

async function callOpenAIWithRetry(prompt: string, maxRetries = 3): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} to call OpenAI API`);
      return await callOpenAI(prompt);
    } catch (error) {
      console.error(`Error during attempt ${attempt + 1}:`, error);
      
      // Don't retry on these errors
      if (error.message?.includes('API key') || 
          error.message?.includes('invalid_request_error')) {
        throw error;
      }
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Failed to get response after multiple retries');
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

    console.log('Processing request for prompt:', userPrompt);
    
    // Log the request
    logRequest(clientId);

    const response = await callOpenAIWithRetry(userPrompt);
    console.log('Successfully received response from OpenAI');
    
    return new Response(
      JSON.stringify({ response }),
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