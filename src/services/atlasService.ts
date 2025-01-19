import { supabase } from "@/integrations/supabase/client";

export const atlasService = {
  async getRandomShill() {
    const { data, error } = await supabase.functions.invoke('chat-with-atlas', {
      body: { 
        message: "Please shill me a random trending cryptocurrency! Be enthusiastic and include some emojis, but also mention risks. Include social media buzz and recent price action.",
        currentTicker: null
      }
    });

    if (error) throw error;
    return data;
  },

  async analyzeToken(ticker: string) {
    const { data, error } = await supabase.functions.invoke('chat-with-atlas', {
      body: { 
        message: `The user has selected ${ticker} as their asset of interest. Please provide a comprehensive analysis starting with token information.`,
        currentTicker: ticker
      }
    });

    if (error) throw error;
    return data;
  },

  async askQuestion(message: string, currentTicker: string) {
    const { data, error } = await supabase.functions.invoke('chat-with-atlas', {
      body: { message, currentTicker }
    });

    if (error) throw error;
    return data;
  }
};