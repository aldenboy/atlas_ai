import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
- Include relevant links when available`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateResearchPaper(ticker: string, analysis: string): Promise<string> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional crypto analyst. Generate a detailed research paper in markdown format.'
        },
        {
          role: 'user',
          content: `Generate a detailed research paper for ${ticker} based on this analysis: ${analysis}`
        }
      ],
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function saveResearchPaper(ticker: string, content: string): Promise<string> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const fileName = `${ticker.toLowerCase()}_research_${new Date().toISOString().slice(0, 10)}.md`;
  const filePath = `${crypto.randomUUID()}/${fileName}`;

  // Upload the markdown file to storage
  const { error: uploadError } = await supabase.storage
    .from('research_papers')
    .upload(filePath, new Blob([content], { type: 'text/markdown' }));

  if (uploadError) {
    console.error('Error uploading research paper:', uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('research_papers')
    .getPublicUrl(filePath);

  // Save metadata to the database
  const { error: dbError } = await supabase
    .from('research_papers')
    .insert({
      token_symbol: ticker,
      title: `${ticker} Research Report`,
      file_path: filePath,
    });

  if (dbError) {
    console.error('Error saving research paper metadata:', dbError);
    throw dbError;
  }

  return publicUrl;
}

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

async function callOpenAI(prompt: string, context: string = ''): Promise<{ response: string; paper?: string }> {
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
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: context ? `${context}\n${prompt}` : prompt }
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

    // Generate and save research paper if this is a new ticker analysis
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

Please provide a comprehensive analysis following the structured format:
1. Complete token information section
2. Market analysis with current data
3. Project analysis
4. Risk assessment
5. Social metrics and community analysis

Format the response clearly with sections and include any relevant links.`;

      const { response, paper } = await callOpenAI(prompt);
      console.log('Successfully generated response and research paper');

      return new Response(
        JSON.stringify({ response, paper }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For follow-up questions
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