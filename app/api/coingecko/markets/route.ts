import { NextResponse, NextRequest } from 'next/server';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const per_page = params.get('per_page') || '20';
    const page = params.get('page') || '1';

    const target = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${encodeURIComponent(
      per_page
    )}&page=${encodeURIComponent(page)}&sparkline=false`;

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

    const data = await response.text();

    // Forward status and body
    const res = new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': response.ok ? 's-maxage=30, stale-while-revalidate=60' : 'no-store'
      }
    });

    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) res.headers.set('Retry-After', retryAfter);

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Proxy error', details: String(err) }, { status: 500 });
  }
}
