import { NextResponse, NextRequest } from 'next/server';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const q = req.nextUrl.searchParams;
    const days = q.get('days') || '90';
    const interval = q.get('interval') || 'daily';

    const target = `${COINGECKO_BASE}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${encodeURIComponent(
      days
    )}&interval=${encodeURIComponent(interval)}`;

    const apiKey = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

    const response = await fetch(target, {
      method: 'GET',
      headers: apiKey
        ? {
            'x-cg-api-key': apiKey,
            'Content-Type': 'application/json'
          }
        : { 'Content-Type': 'application/json' },
    });

    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      // Fallback to text if response isn't JSON
      data = await response.text();
    }

    const res = NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': response.ok ? 's-maxage=60, stale-while-revalidate=300' : 'no-store'
      }
    });

    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) res.headers.set('Retry-After', retryAfter);

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Proxy error', details: String(err) }, { status: 500 });
  }
}
