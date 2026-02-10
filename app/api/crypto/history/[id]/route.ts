import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const days = request.nextUrl.searchParams.get('days') || '90';
    const interval = request.nextUrl.searchParams.get('interval') || 'daily';
    
    const apiKey = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    
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
        cache: 'no-store',
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
