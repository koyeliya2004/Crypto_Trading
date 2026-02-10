/**
 * API Integration Test Script
 * This script tests all API integrations in the Crypto Trading app
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing API Integrations...\n');

// Test 1: Check Environment Variables
console.log('1️⃣ Checking Environment Variables:');
const coingeckoApiKey = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
const envVars = {
  'GROQ_API_KEY': process.env.GROQ_API_KEY,
  'COINGECKO_API_KEY': coingeckoApiKey,
  'NEXT_PUBLIC_NEWSDATA_API_KEY': process.env.NEXT_PUBLIC_NEWSDATA_API_KEY,
  'VERCEL_TOKEN': process.env.VERCEL_TOKEN,
  'RENDER_TOKEN': process.env.RENDER_TOKEN,
  'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let allEnvVarsPresent = true;
for (const [key, value] of Object.entries(envVars)) {
  const status = value ? '✅' : '❌';
  console.log(`   ${status} ${key}: ${value ? '***' + value.substring(value.length - 4) : 'NOT SET'}`);
  if (!value) allEnvVarsPresent = false;
}
console.log(allEnvVarsPresent ? '   ✅ All environment variables are set!\n' : '   ⚠️  Some environment variables are missing\n');

// Allow overriding the local dev server port when Next.js runs on a non-default port
const DEV_PORT = process.env.DEV_PORT || 3000;

// Test 2: Test Groq API (Chat)
console.log('2️⃣ Testing Groq API (Chat Feature):');
async function testGroqAPI() {
  try {
    const response = await fetch(`http://localhost:${DEV_PORT}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, what is Bitcoin?' })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Chat API is working!');
      console.log(`   📝 Sample response: ${data.response?.substring(0, 100)}...\n`);
      return true;
    } else {
      const error = await response.text();
      console.log('   ❌ Chat API failed:', response.status, error.substring(0, 100));
      return false;
    }
  } catch (error) {
    console.log('   ❌ Chat API error:', error.message);
    return false;
  }
}

// Test 3: Test CoinGecko API (Market Data)
console.log('3️⃣ Testing CoinGecko API (Market Data):');
async function testCoinGeckoAPI() {
  try {
    // Test the market data endpoint
    const apiKey = coingeckoApiKey;
    if (!apiKey) {
      console.log('   ❌ CoinGecko API key not set');
      return false;
    }
    
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false',
      {
        headers: {
          'x-cg-demo-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ CoinGecko API is working!');
      console.log(`   📊 Retrieved data for ${data.length} cryptocurrencies`);
      if (data.length > 0) {
        console.log(`   💰 Top crypto: ${data[0].name} ($${data[0].current_price})\n`);
      }
      return true;
    } else {
      const error = await response.text();
      console.log('   ❌ CoinGecko API failed:', response.status, error.substring(0, 100));
      return false;
    }
  } catch (error) {
    console.log('   ❌ CoinGecko API error:', error.message);
    return false;
  }
}

// Test 4: Test NewsData API (News Feature)
console.log('4️⃣ Testing NewsData API (News Feature):');
async function testNewsDataAPI() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    if (!apiKey) {
      console.log('   ❌ NewsData API key not set');
      return false;
    }
    
    const params = new URLSearchParams({
      apikey: apiKey,
      q: 'bitcoin',
      language: 'en',
    });
    
    const response = await fetch(`https://newsdata.io/api/1/news?${params.toString()}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ NewsData API is working!');
      console.log(`   📰 Retrieved ${data.totalResults || 0} news articles`);
      if (data.results && data.results.length > 0) {
        console.log(`   📄 Latest: ${data.results[0].title?.substring(0, 60)}...\n`);
      }
      return true;
    } else {
      const error = await response.text();
      console.log('   ❌ NewsData API failed:', response.status, error.substring(0, 100));
      return false;
    }
  } catch (error) {
    console.log('   ❌ NewsData API error:', error.message);
    return false;
  }
}

// Test 5: Test Firebase Configuration
console.log('5️⃣ Testing Firebase Configuration:');
function testFirebaseConfig() {
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    const allConfigPresent = Object.values(firebaseConfig).every(val => val);
    if (allConfigPresent) {
      console.log('   ✅ Firebase configuration is complete');
      console.log(`   🔥 Project ID: ${firebaseConfig.projectId}\n`);
      return true;
    } else {
      console.log('   ⚠️  Some Firebase configuration values are missing\n');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Firebase config error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════\n');
  
  const results = {
    envVars: allEnvVarsPresent,
    firebase: testFirebaseConfig(),
    groq: await testGroqAPI(),
    coingecko: await testCoinGeckoAPI(),
    newsdata: await testNewsDataAPI(),
  };
  
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 SUMMARY:\n');
  console.log(`   Environment Variables: ${results.envVars ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Firebase Config: ${results.firebase ? '✅ PASS' : '⚠️  INCOMPLETE'}`);
  console.log(`   Groq API (Chat): ${results.groq ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   CoinGecko API (Market): ${results.coingecko ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   NewsData API (News): ${results.newsdata ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n   Total: ${passedTests}/${totalTests} tests passed`);
  console.log('═══════════════════════════════════════════════════\n');
  
  if (passedTests === totalTests) {
    console.log('🎉 All API integrations are working correctly!\n');
  } else if (passedTests > 0) {
    console.log('⚠️  Some API integrations need attention.\n');
  } else {
    console.log('❌ API integrations are not working. Check your configuration.\n');
  }
}

// Execute tests
runAllTests().catch(console.error);
