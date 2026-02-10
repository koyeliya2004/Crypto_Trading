import { NextResponse, NextRequest } from 'next/server';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const isDevelopment = process.env.NODE_ENV === 'development';

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';

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

    // Retry the upstream request on transient errors (429, 5xx)
    // This ensures resilience against temporary CoinGecko API issues
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

        // If rate limited, respect Retry-After header before retrying
        // This ensures we don't overwhelm the upstream API
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : (Math.pow(2, attempt) * 1000);
          console.log(`Rate limited for ${id}, waiting ${waitMs}ms before retry ${attempt + 1}/${maxRetries}`);
          await new Promise(r => setTimeout(r, isNaN(waitMs) ? 1000 : waitMs));
          attempt++;
          continue;
        }

        // For 5xx errors, use exponential backoff and retry
        // This handles temporary upstream server issues
        if (response.status >= 500) {
          const waitMs = Math.pow(2, attempt) * 1000;
          console.log(`Upstream 5xx error for ${id}, waiting ${waitMs}ms before retry ${attempt + 1}/${maxRetries}`);
          await new Promise(r => setTimeout(r, waitMs));
          attempt++;
          continue;
        }

        break;
      } catch (err) {
        lastError = err;
        const waitMs = Math.pow(2, attempt) * 1000;
        console.log(`Network error for ${id}, waiting ${waitMs}ms before retry ${attempt + 1}/${maxRetries}:`, err);
        await new Promise(r => setTimeout(r, waitMs));
        attempt++;
      }
    }

    if (!response) {
      console.error('Market chart fetch failed after retries:', { id, days, interval, error: String(lastError) });
      return NextResponse.json(
        { 
          error: 'Upstream request failed', 
          details: isDevelopment ? String(lastError) : 'Unable to reach CoinGecko API'
        },
        { status: 502 }
      );
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
        'Cache-Control': response.ok ? 's-maxage=60, stale-while-revalidate=300' : 'no-store'
      }
    });

    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) res.headers.set('Retry-After', retryAfter);

    // If the upstream ultimately failed after retries, surface a 502
    if (!response.ok) {
      console.error('Market chart upstream error:', { id, days, interval, status: response.status, dataSnippet: typeof data === 'string' ? data.substring(0, 200) : JSON.stringify(data).substring(0, 200) });
      return NextResponse.json(
        { 
          error: 'Upstream error', 
          status: response.status, 
          ...(isDevelopment && { data })
        },
        { status: 502 }
      );
    }

    return res;
  } catch (err) {
    console.error('Market chart proxy error:', { error: String(err) });
    return NextResponse.json(
      { 
        error: 'Proxy error', 
        details: isDevelopment ? String(err) : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
