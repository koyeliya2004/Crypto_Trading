import { NextResponse } from 'next/server';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['x-cg-api-key'] = apiKey;
    }

    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
      {
        headers,
        next: { revalidate: 30 } // Cache for 30 seconds
      }
    );

    if (!response.ok) {
      console.error('CoinGecko API error:', response.status, response.statusText);
      
      // Return mock data if API fails
      return NextResponse.json([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 45000,
          market_cap: 880000000000,
          market_cap_rank: 1,
          total_volume: 28000000000,
          price_change_percentage_24h: 2.5,
          circulating_supply: 19500000,
          total_supply: 21000000,
          max_supply: 21000000,
          ath: 69000,
          ath_date: '2021-11-10T14:24:11.849Z',
          atl: 67.81,
          atl_date: '2013-07-06T00:00:00.000Z',
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 2400,
          market_cap: 290000000000,
          market_cap_rank: 2,
          total_volume: 15000000000,
          price_change_percentage_24h: 1.8,
          circulating_supply: 120000000,
          total_supply: 120000000,
          max_supply: null,
          ath: 4878,
          ath_date: '2021-11-10T14:24:19.604Z',
          atl: 0.432979,
          atl_date: '2015-10-20T00:00:00.000Z',
        }
      ]);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in markets API route:', error);
    
    // Return mock data on error
    return NextResponse.json([
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 45000,
        market_cap: 880000000000,
        market_cap_rank: 1,
        total_volume: 28000000000,
        price_change_percentage_24h: 2.5,
        circulating_supply: 19500000,
        total_supply: 21000000,
        max_supply: 21000000,
        ath: 69000,
        ath_date: '2021-11-10T14:24:11.849Z',
        atl: 67.81,
        atl_date: '2013-07-06T00:00:00.000Z',
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 2400,
        market_cap: 290000000000,
        market_cap_rank: 2,
        total_volume: 15000000000,
        price_change_percentage_24h: 1.8,
        circulating_supply: 120000000,
        total_supply: 120000000,
        max_supply: null,
        ath: 4878,
        ath_date: '2021-11-10T14:24:19.604Z',
        atl: 0.432979,
        atl_date: '2015-10-20T00:00:00.000Z',
      }
    ]);
  }
}
