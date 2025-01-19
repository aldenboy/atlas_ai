import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export async function generateResearchPaper(ticker: string, analysis: string): Promise<string> {
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

export async function saveResearchPaper(ticker: string, content: string): Promise<string> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const fileName = `${ticker.toLowerCase()}_research_${new Date().toISOString().slice(0, 10)}.md`;
  const filePath = `${crypto.randomUUID()}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('research_papers')
    .upload(filePath, new Blob([content], { type: 'text/markdown' }));

  if (uploadError) {
    console.error('Error uploading research paper:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('research_papers')
    .getPublicUrl(filePath);

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