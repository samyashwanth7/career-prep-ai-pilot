
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { industry, role, experienceLevel, weakAreas, previousPerformance } = await req.json();

    console.log('Generating personalized questions...');

    const systemPrompt = `You are an expert interview coach. Generate personalized interview questions based on the candidate's profile and performance history.

Generate 10 highly relevant questions that:
1. Match the industry and role requirements
2. Are appropriate for the experience level
3. Address identified weak areas
4. Build on previous performance patterns
5. Include a mix of behavioral, technical, and situational questions

Return only a JSON object with a "questions" array containing the question strings.`;

    const userPrompt = `Candidate Profile:
- Industry: ${industry}
- Role: ${role}
- Experience Level: ${experienceLevel}
- Weak Areas: ${weakAreas?.join(', ') || 'None specified'}
- Previous Performance Summary: ${previousPerformance ? JSON.stringify(previousPerformance.slice(-3)) : 'No previous data'}

Generate 10 personalized interview questions that will help this candidate improve and prepare for their target role.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    console.log('Personalized questions generated successfully');

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Question generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
