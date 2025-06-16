
export async function askOpenAIChat(messages: { role: 'system' | 'user' | 'assistant', content: string }[]): Promise<string> {
  try {
    // Use Supabase Edge Function for secure OpenAI integration
    const response = await fetch(
      `${window.location.origin}/functions/v1/openai-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages,
          temperature: 0.6,
          max_tokens: 250
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || response.statusText || "Failed to call OpenAI via Edge Function");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`AI service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
