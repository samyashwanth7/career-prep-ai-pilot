
export async function askOpenAIChat(messages: { role: 'system' | 'user' | 'assistant', content: string }[]): Promise<string> {
  const apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) throw new Error('Missing OpenAI API key.');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.6,
      max_tokens: 250
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || response.statusText || "Failed to call OpenAI");
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
}
