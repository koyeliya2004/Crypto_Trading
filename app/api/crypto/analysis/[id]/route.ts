import { NextRequest, NextResponse } from 'next/server';
import { getCryptoHistory } from '@/app/lib/api';
import { calculateRSI, calculateMACD, calculateBollingerBands, calculateMovingAverages } from '@/app/lib/indicators';

// Removed `generateStaticParams` to avoid prefetching crypto history at build
// time. Fetching many coin histories during SSG caused upstream rate-limiting
// and build-time failures on Vercel. The analysis route will now run at
// request-time, reducing build-time external requests.

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Simple in-memory cache to reduce repeated upstream requests on the server
  // Cache key: coin id, value: { ts, response }
  // TTL: 5 minutes (reduce upstream load and avoid rate limits)
  const CACHE_TTL = 5 * 60 * 1000;
  // Use a module-scoped cache Map (will persist while the server instance is warm)
  // Use `any` cast to avoid TypeScript complaining about unknown global properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (globalThis as any).__analysisCache === 'undefined') {
    (globalThis as any).__analysisCache = new Map<string, { ts: number; data: any }>();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analysisCache: Map<string, { ts: number; data: any }> = (globalThis as any).__analysisCache;

  try {
    const id = params.id.toLowerCase(); // CoinGecko requires lowercase IDs
    console.log('Fetching data for:', id);

    // Return cached response when available and fresh
    const cached = analysisCache.get(id);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      console.log(`Returning cached analysis for ${id}`);
      return NextResponse.json(cached.data);
    }

    // Use daily data for the last 90 days instead of hourly
    let history;
    try {
      history = await getCryptoHistory(id, 90, 'daily');
    } catch (upstreamError) {
      console.error('Upstream error fetching history for:', id, upstreamError);
      // If upstream indicates rate limiting, surface a 503 so the client can retry
      const status = (upstreamError as any)?.status || (String(upstreamError).includes('429') ? 429 : 500);
      if (status === 429) {
        return NextResponse.json({ error: 'Upstream rate limited' }, { status: 503 });
      }
      return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 502 });
    }
    console.log('History response:', history);

    if (!history?.prices?.length) {
      console.error('No price data available for:', id);
      return NextResponse.json(
        { error: 'No price data available' },
        { status: 404 }
      );
    }

    // Format and validate prices
    const prices = history.prices
      .filter(([timestamp, price]) => 
        timestamp && typeof price === 'number' && !isNaN(price) && price > 0
      )
      .map(([timestamp, price]) => ({
        time: Math.floor(timestamp / 1000),
        value: price
      }));

    // Ensure we have enough data points for calculations
    if (prices.length < 26) { // MACD requires at least 26 points
      console.error('Insufficient data points for:', id);
      return NextResponse.json(
        { error: 'Insufficient data for analysis' },
        { status: 400 }
      );
    }

    const closePrices = prices.map(p => p.value);

    // Calculate indicators with proper error handling
    let rsi, macd, bb, ma;
    try {
      rsi = calculateRSI(closePrices);
      macd = calculateMACD(closePrices);
      bb = calculateBollingerBands(closePrices);
      ma = calculateMovingAverages(closePrices);

      // Validate indicator results
      if (!rsi?.length || !macd?.MACD?.length || !bb?.upper?.length) {
        throw new Error('Invalid indicator results');
      }
    } catch (error) {
      console.error('Error calculating indicators for:', id, error);
      return NextResponse.json(
        { error: 'Failed to calculate indicators' },
        { status: 500 }
      );
    }

    const response = {
      prices,
      indicators: {
        rsi: rsi[rsi.length - 1],
        macd: {
          macdLine: macd.MACD[macd.MACD.length - 1],
          signalLine: macd.signal[macd.signal.length - 1],
          histogram: macd.histogram[macd.histogram.length - 1]
        },
        bollingerBands: {
          upper: bb.upper[bb.upper.length - 1],
          middle: bb.middle[bb.middle.length - 1],
          lower: bb.lower[bb.lower.length - 1]
        },
        movingAverages: ma
      }
    };

    // Log a summary of the response instead of the full object to avoid console truncation
    console.log('Sending response with:', {
      pricePoints: prices.length,
      indicators: {
        rsi: rsi[rsi.length - 1].toFixed(2),
        macd: {
          macdLine: macd.MACD[macd.MACD.length - 1].toFixed(2),
          signalLine: macd.signal[macd.signal.length - 1].toFixed(2),
          histogram: macd.histogram[macd.histogram.length - 1].toFixed(2)
        },
        bollingerBands: {
          upper: bb.upper[bb.upper.length - 1].toFixed(2),
          middle: bb.middle[bb.middle.length - 1].toFixed(2),
          lower: bb.lower[bb.lower.length - 1].toFixed(2)
        },
        movingAverages: {
          ma20: ma.ma20.toFixed(2),
          ma50: ma.ma50.toFixed(2),
          ma200: ma.ma200.toFixed(2)
        }
      }
    });
    // Cache the successful response
    try {
      analysisCache.set(id, { ts: Date.now(), data: response });
    } catch (cacheErr) {
      console.warn('Failed to cache analysis response:', cacheErr);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in analysis endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to analyze crypto data' },
      { status: 500 }
    );
  }
}
