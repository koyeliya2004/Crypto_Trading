import { NextResponse, NextRequest } from 'next/server';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const per_page = params.get('per_page') || '20';
    const page = params.get('page') || '1';

    const target = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${encodeURIComponent(
      per_page
    )}&page=${encodeURIComponent(page)}&sparkline=false`;

    const apiKey = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

    // Retry the upstream request on transient errors (429, 5xx)
    const maxRetries = 3;
    let attempt = 0;
    let response: Response | null = null;
    let lastError: any = null;
    const headers = apiKey
      ? {
          'x-cg-demo-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      : { 'Content-Type': 'application/json' };
    // Ensure the headers type matches Fetch API's HeadersInit
    const fetchHeaders: HeadersInit = headers as HeadersInit;

    while (attempt < maxRetries) {
      try {
        response = await fetch(target, { method: 'GET', headers: fetchHeaders });
        // If successful or client error (4xx except 429), break and return
        if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
          break;
        }

        // If rate limited, try to respect Retry-After before retrying
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : (Math.pow(2, attempt) * 1000);
          await new Promise(r => setTimeout(r, isNaN(waitMs) ? 1000 : waitMs));
          attempt++;
          continue;
        }

        // For 5xx errors, backoff and retry
        if (response.status >= 500) {
          const waitMs = Math.pow(2, attempt) * 1000;
          await new Promise(r => setTimeout(r, waitMs));
          attempt++;
          continue;
        }

        break;
      } catch (err) {
        lastError = err;
        const waitMs = Math.pow(2, attempt) * 1000;
        await new Promise(r => setTimeout(r, waitMs));
        attempt++;
      }
    }

    if (!response) {
      return NextResponse.json({ error: 'Upstream request failed', details: String(lastError) }, { status: 502 });
    }

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
        'Cache-Control': response.ok ? 's-maxage=30, stale-while-revalidate=60' : 'no-store'
      }
    });

    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) res.headers.set('Retry-After', retryAfter);

    // If the upstream ultimately failed after retries, surface a 502
    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream error', status: response.status, data }, { status: 502 });
    }

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Proxy error', details: String(err) }, { status: 500 });
  }
}
