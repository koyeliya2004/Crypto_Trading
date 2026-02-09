import { NextResponse } from 'next/server';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '90';
    const interval = searchParams.get('interval') || 'daily';
    
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['x-cg-api-key'] = apiKey;
    }

    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${params.id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`,
      {
        headers,
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error('CoinGecko API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch crypto history' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in history API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
