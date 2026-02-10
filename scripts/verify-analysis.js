#!/usr/bin/env node

/**
 * Verification script for the crypto analysis endpoint
 * 
 * Usage:
 *   node scripts/verify-analysis.js [coin-id] [base-url]
 * 
 * Examples:
 *   node scripts/verify-analysis.js bitcoin http://localhost:3000
 *   node scripts/verify-analysis.js ethereum https://crypto-trading-teal.vercel.app
 */

const https = require('https');
const http = require('http');

const coinId = process.argv[2] || 'bitcoin';
const baseUrl = process.argv[3] || 'http://localhost:3000';
const days = process.argv[4] || '90';

const url = `${baseUrl}/api/crypto/analysis/${coinId}?days=${days}`;

console.log('='.repeat(60));
console.log('Crypto Analysis Endpoint Verification');
console.log('='.repeat(60));
console.log(`URL: ${url}`);
console.log(`Coin: ${coinId}`);
console.log(`Days: ${days}`);
console.log('='.repeat(60));
console.log('');

const client = url.startsWith('https') ? https : http;

const startTime = Date.now();
const request = client.get(url, (response) => {
  const duration = Date.now() - startTime;
  let body = '';

  response.on('data', (chunk) => {
    body += chunk;
  });

  response.on('end', () => {
    console.log(`Status: ${response.statusCode} ${response.statusMessage}`);
    console.log(`Duration: ${duration}ms`);
    console.log('');
    console.log('Headers:');
    Object.keys(response.headers).forEach((key) => {
      console.log(`  ${key}: ${response.headers[key]}`);
    });
    console.log('');
    
    try {
      const data = JSON.parse(body);
      
      if (response.statusCode === 200) {
        console.log('✅ SUCCESS');
        console.log('');
        console.log('Response Summary:');
        console.log(`  Price Points: ${data.prices?.length || 0}`);
        console.log('');
        
        if (data.indicators) {
          console.log('Indicators:');
          console.log(`  RSI: ${data.indicators.rsi?.toFixed(2) || 'N/A'}`);
          console.log(`  MACD Line: ${data.indicators.macd?.macdLine?.toFixed(2) || 'N/A'}`);
          console.log(`  Signal Line: ${data.indicators.macd?.signalLine?.toFixed(2) || 'N/A'}`);
          console.log(`  Histogram: ${data.indicators.macd?.histogram?.toFixed(2) || 'N/A'}`);
          console.log(`  BB Upper: ${data.indicators.bollingerBands?.upper?.toFixed(2) || 'N/A'}`);
          console.log(`  BB Middle: ${data.indicators.bollingerBands?.middle?.toFixed(2) || 'N/A'}`);
          console.log(`  BB Lower: ${data.indicators.bollingerBands?.lower?.toFixed(2) || 'N/A'}`);
          console.log(`  MA20: ${data.indicators.movingAverages?.ma20?.toFixed(2) || 'N/A'}`);
          console.log(`  MA50: ${data.indicators.movingAverages?.ma50?.toFixed(2) || 'N/A'}`);
          console.log(`  MA200: ${data.indicators.movingAverages?.ma200?.toFixed(2) || 'N/A'}`);
        }
        
        console.log('');
        console.log('First 3 prices:');
        if (data.prices && data.prices.length > 0) {
          data.prices.slice(0, 3).forEach((price, idx) => {
            const date = new Date(price.time * 1000);
            console.log(`  ${idx + 1}. ${date.toISOString()}: $${price.value.toFixed(2)}`);
          });
        }
        
        console.log('');
        console.log('Last 3 prices:');
        if (data.prices && data.prices.length > 0) {
          data.prices.slice(-3).forEach((price, idx) => {
            const date = new Date(price.time * 1000);
            console.log(`  ${data.prices.length - 2 + idx}. ${date.toISOString()}: $${price.value.toFixed(2)}`);
          });
        }
      } else {
        console.log('❌ ERROR');
        console.log('');
        console.log('Error Response:');
        console.log(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.log('❌ PARSE ERROR');
      console.log('');
      console.log('Raw Response (first 500 chars):');
      console.log(body.substring(0, 500));
      if (body.length > 500) {
        console.log('...(truncated)');
      }
    }
    
    console.log('');
    console.log('='.repeat(60));
  });
});

request.on('error', (error) => {
  console.log('❌ REQUEST FAILED');
  console.log('');
  console.log('Error:', error.message);
  console.log('');
  console.log('Make sure:');
  console.log('  1. The server is running (npm run dev)');
  console.log('  2. The base URL is correct');
  console.log('  3. You have network connectivity');
  console.log('');
  console.log('='.repeat(60));
  process.exit(1);
});

request.on('timeout', () => {
  console.log('❌ REQUEST TIMEOUT');
  console.log('');
  console.log('The request took too long to complete.');
  console.log('');
  console.log('='.repeat(60));
  request.destroy();
  process.exit(1);
});

// Set timeout to 30 seconds
request.setTimeout(30000);
