import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
        temperature: 0.7,
        max_tokens: 500, // Add a token limit to control costs
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      
      // Check for specific error types
      if (error.error?.message?.includes('exceeded your current quota')) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (error.error?.message?.includes('invalid_api_key')) {
        throw new Error('Invalid API key configuration. Please check your settings.');
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
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});