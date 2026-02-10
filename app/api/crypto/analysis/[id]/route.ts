import { NextRequest, NextResponse } from 'next/server';
import { getCryptoHistory } from '@/app/lib/api';
import { calculateRSI, calculateMACD, calculateBollingerBands, calculateMovingAverages } from '@/app/lib/indicators';
import { ApiError } from '@/app/lib/utils';

// Removed `generateStaticParams` to avoid prefetching crypto history at build
// time. Fetching many coin histories during SSG caused upstream rate-limiting
// and build-time failures on Vercel. The analysis route will now run at
// request-time, reducing build-time external requests.

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const isDevelopment = process.env.NODE_ENV === 'development';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Simple in-memory cache to reduce repeated upstream requests on the server
  // Cache key: coin id, value: { ts, number; data: response object }
  // TTL: 5 minutes (reduce upstream load and avoid rate limits)
  const CACHE_TTL = 5 * 60 * 1000;
  // Use a module-scoped cache Map (will persist while the server instance is warm)
  if (typeof (globalThis as Record<string, unknown>).__analysisCache === 'undefined') {
    (globalThis as Record<string, unknown>).__analysisCache = new Map<string, { ts: number; data: unknown }>();
  }
  const analysisCache = (globalThis as Record<string, unknown>).__analysisCache as Map<string, { ts: number; data: unknown }>;

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
    // getCryptoHistory already has retry logic with exponential backoff
    let history;
    try {
      history = await getCryptoHistory(id, 90, 'daily');
    } catch (upstreamError) {
      // Enhanced error logging with structured object for better diagnostics in Vercel logs
      const apiError = upstreamError as ApiError;
      const errorDetails = {
        id,
        status: apiError.status,
        message: apiError.message,
        data: apiError.data,
        // Include response body snippet (first 200 chars) for diagnostics
        bodySnippet: apiError.body ? apiError.body.substring(0, 200) : undefined
      };
      
      console.error('Upstream error fetching history:', errorDetails);
      
      // Return appropriate status codes based on the upstream error
      // 429: Rate limited - return 503 Service Unavailable with Retry-After suggestion
      if (apiError.status === 429) {
        return NextResponse.json(
          {
            error: 'Upstream rate limited',
            message: 'CoinGecko API rate limit exceeded. Please try again later.',
            ...(isDevelopment && { details: errorDetails })
          },
          { status: 503 }
        );
      }
      
      // 4xx client errors (except 429) - return 502 Bad Gateway
      if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
        return NextResponse.json(
          {
            error: 'Invalid upstream request',
            message: `Failed to fetch price history: ${apiError.message}`,
            ...(isDevelopment && { details: errorDetails })
          },
          { status: 502 }
        );
      }
      
      // 5xx server errors or network errors - return 502 Bad Gateway
      return NextResponse.json(
        {
          error: 'Failed to fetch price history',
          message: 'Unable to retrieve data from upstream API',
          ...(isDevelopment && { details: errorDetails })
        },
        { status: 502 }
      );
    }
    console.log('History response received with', history?.prices?.length || 0, 'price points');

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

    // Calculate indicators with proper error handling and validation
    // Validate each indicator result before indexing to avoid undefined access errors
    let rsi, macd, bb, ma;
    try {
      rsi = calculateRSI(closePrices);
      macd = calculateMACD(closePrices);
      bb = calculateBollingerBands(closePrices);
      ma = calculateMovingAverages(closePrices);

      // Comprehensive validation of indicator results to prevent undefined indexing
      // Each indicator must return arrays with at least one element
      if (!Array.isArray(rsi) || rsi.length === 0) {
        throw new Error('RSI calculation returned invalid result');
      }
      if (!macd || !Array.isArray(macd.MACD) || macd.MACD.length === 0 ||
          !Array.isArray(macd.signal) || macd.signal.length === 0 ||
          !Array.isArray(macd.histogram) || macd.histogram.length === 0) {
        throw new Error('MACD calculation returned invalid result');
      }
      if (!bb || !Array.isArray(bb.upper) || bb.upper.length === 0 ||
          !Array.isArray(bb.middle) || bb.middle.length === 0 ||
          !Array.isArray(bb.lower) || bb.lower.length === 0) {
        throw new Error('Bollinger Bands calculation returned invalid result');
      }
      if (!ma || typeof ma.ma20 !== 'number' || typeof ma.ma50 !== 'number' || typeof ma.ma200 !== 'number') {
        throw new Error('Moving Averages calculation returned invalid result');
      }
      
      // Additional validation: check that the values are finite numbers
      const lastRSI = rsi[rsi.length - 1];
      const lastMACD = macd.MACD[macd.MACD.length - 1];
      const lastSignal = macd.signal[macd.signal.length - 1];
      const lastHistogram = macd.histogram[macd.histogram.length - 1];
      const lastBBUpper = bb.upper[bb.upper.length - 1];
      const lastBBMiddle = bb.middle[bb.middle.length - 1];
      const lastBBLower = bb.lower[bb.lower.length - 1];
      
      if (!isFinite(lastRSI) || !isFinite(lastMACD) || !isFinite(lastSignal) ||
          !isFinite(lastHistogram) || !isFinite(lastBBUpper) || !isFinite(lastBBMiddle) ||
          !isFinite(lastBBLower) || !isFinite(ma.ma20) || !isFinite(ma.ma50) || !isFinite(ma.ma200)) {
        throw new Error('Indicator calculations produced non-finite values');
      }
    } catch (error) {
      // Enhanced error logging for indicator calculation failures
      const errorDetails = {
        id,
        error: error instanceof Error ? error.message : String(error),
        dataPoints: closePrices.length,
        priceRange: {
          min: Math.min(...closePrices),
          max: Math.max(...closePrices)
        }
      };
      console.error('Error calculating indicators:', errorDetails);
      
      return NextResponse.json(
        {
          error: 'Failed to calculate indicators',
          message: 'Technical indicator calculation failed. The data may be insufficient or invalid.',
          ...(isDevelopment && { details: errorDetails })
        },
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
    console.log('Analysis successful for', id, ':', {
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
    
    // Only cache valid, successful responses to avoid caching errors
    try {
      analysisCache.set(id, { ts: Date.now(), data: response });
    } catch (cacheErr) {
      console.warn('Failed to cache analysis response:', cacheErr);
    }

    return NextResponse.json(response);
  } catch (error) {
    // Catch-all error handler for unexpected errors
    const errorDetails = {
      id: params.id,
      error: error instanceof Error ? error.message : String(error),
      stack: isDevelopment && error instanceof Error ? error.stack : undefined
    };
    console.error('Unexpected error in analysis endpoint:', errorDetails);
    
    return NextResponse.json(
      {
        error: 'Failed to analyze crypto data',
        message: 'An unexpected error occurred while analyzing the cryptocurrency data.',
        ...(isDevelopment && { details: errorDetails })
      },
      { status: 500 }
    );
  }
}
