
export async function askOpenAIChat(messages: { role: 'system' | 'user' | 'assistant', content: string }[]): Promise<string> {
  const apiKey = localStorage.getItem('openai_api_key');

  // Use edge function if no local apiKey or always for extra privacy
  try {
    const response = await fetch(
      `${window.location.origin}/functions/v1/openai-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { "Authorization": `Bearer ${apiKey}` }) // Optional: support for private beta
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          temperature: 0.6,
          max_tokens: 250
        }),
      }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || response.statusText || "Failed to call OpenAI (edge function)");
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
  } catch (e) {
    // fallback to direct API if local key available (legacy/dev)
    if (apiKey) {
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
    } else {
      throw e;
    }
  }
}
