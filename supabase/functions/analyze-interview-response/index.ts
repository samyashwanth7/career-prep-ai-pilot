
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
    const { questionText, transcription, questionType, duration, industry, role } = await req.json();

    console.log('Analyzing interview response...');

    const systemPrompt = `You are an expert interview coach and AI analyst. Analyze the following interview response and provide detailed, actionable feedback.

Question Type: ${questionType}
Industry: ${industry || 'General'}
Role: ${role || 'General'}
Response Duration: ${duration} seconds

Analyze the response for:
1. Content quality (specificity, relevance, impact, structure)
2. Communication clarity and confidence
3. Industry and role-specific requirements
4. STAR method usage (for behavioral questions)
5. Technical accuracy (for technical questions)

Provide scores (0-100) and specific, actionable suggestions for improvement.`;

    const userPrompt = `Interview Question: "${questionText}"

Candidate Response: "${transcription}"

Please analyze this response and return a JSON object with the following structure:
{
  "overallScore": number (0-100),
  "specificity": number (0-100),
  "relevance": number (0-100),
  "impact": number (0-100),
  "structure": number (0-100),
  "communicationClarity": number (0-100),
  "confidence": number (0-100),
  "starMethod": {
    "situation": boolean,
    "task": boolean,
    "action": boolean,
    "result": boolean,
    "score": number (0-100)
  },
  "technicalAccuracy": number (0-100, for technical questions),
  "suggestions": ["specific suggestion 1", "specific suggestion 2", ...],
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement area 1", "improvement area 2", ...],
  "industrySpecificFeedback": "detailed feedback specific to the industry/role",
  "nextSteps": ["actionable next step 1", "actionable next step 2", ...]
}`;

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
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices[0].message.content);

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
