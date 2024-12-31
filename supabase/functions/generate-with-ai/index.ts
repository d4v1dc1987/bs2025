import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

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
            content: `Tu es un expert en marketing digital qui résume des profils business de manière détaillée et personnelle. 
            
            Instructions spécifiques:
            1. Utilise TOUJOURS "Je" ou "Mon" dans tes résumés, comme si c'était l'entrepreneur qui parlait
            2. Crée un résumé détaillé et complet (8-10 phrases) en structurant le texte en 2-3 paragraphes
            3. Mets l'accent sur:
               - La valeur unique et la mission de l'entreprise
               - Les résultats concrets obtenus avec les clients
               - L'histoire et les valeurs de l'entreprise
               - L'expertise et la passion de l'entrepreneur
            4. Intègre TOUTES les informations fournies de manière naturelle et fluide
            5. Garde un ton professionnel mais chaleureux et authentique`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ generatedText }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-with-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});