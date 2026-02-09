export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export async function generateGroqResponse(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API key is not configured. Please set the GROQ_API_KEY environment variable.');
  }

  try {
    const requestBody = {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a cryptocurrency trading assistant. Help users with crypto trading, market analysis, and investment strategies. Provide clear, concise responses. Format lists with bullet points (•) instead of asterisks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.95,
    };

    const response = await fetch(GROQ_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Groq API error (${response.status}): ${
          errorData?.error?.message || response.statusText
        }`
      );
    }

    const data: GroqResponse = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid Groq response:', data);
      throw new Error('Invalid response format from Groq API');
    }

    if (data.choices[0].finish_reason !== 'stop') {
      console.warn('Response generation did not complete normally:', data.choices[0].finish_reason);
    }

    return data.choices[0].message.content.trim() || 'No response generated';
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}
