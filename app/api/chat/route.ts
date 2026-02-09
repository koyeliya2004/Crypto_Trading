import { NextResponse } from 'next/server';
import { generateGroqResponse } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await generateGroqResponse(message);

    // Clean up the response by replacing asterisks with bullet points
    const cleanedResponse = response
      .replace(/\*\*/g, '') // Remove double asterisks
      .replace(/\*/g, '•')  // Replace single asterisks with bullet points
      .trim();

    return NextResponse.json({ response: cleanedResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate response';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
