# How to Run API Integration Tests

This document explains how to run the automated API integration tests for the Crypto Trading application.

## Running the Tests Locally

### Prerequisites
- Node.js installed
- All dependencies installed (`npm install`)
- `.env.local` file configured with API keys

### Steps

1. **Ensure the development server is running:**
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:3000`

2. **Open a new terminal and run the test script:**
   ```bash
   node test-api-integrations.js
   ```

### What the Tests Check

The automated test script verifies:

1. ✅ **Environment Variables** - All required API keys are set
2. ✅ **Firebase Configuration** - Firebase config is complete
3. ⚠️ **Groq API (Chat)** - Chat endpoint functionality*
4. ⚠️ **CoinGecko API (Market Data)** - Market data fetching*
5. ⚠️ **NewsData API (News)** - News article retrieval*

\* *API tests require internet access and will fail in sandboxed/offline environments*

### Expected Output

```
🔍 Testing API Integrations...

1️⃣ Checking Environment Variables:
   ✅ GROQ_API_KEY: ***XXXX
   ✅ COINGECKO_API_KEY: ***XXXX
   ✅ NEXT_PUBLIC_NEWSDATA_API_KEY: ***XXXX
   ✅ VERCEL_TOKEN: ***XXXX
   ✅ RENDER_TOKEN: ***XXXX
   ✅ NEXT_PUBLIC_FIREBASE_API_KEY: ***XXXX
   ✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID: ***XXXX
   ✅ All environment variables are set!

2️⃣ Testing Groq API (Chat Feature):
   ✅ Chat API is working!
   📝 Sample response: ...

3️⃣ Testing CoinGecko API (Market Data):
   ✅ CoinGecko API is working!
   📊 Retrieved data for 5 cryptocurrencies
   💰 Top crypto: Bitcoin ($XX,XXX)

4️⃣ Testing NewsData API (News Feature):
   ✅ NewsData API is working!
   📰 Retrieved XX news articles
   📄 Latest: ...

5️⃣ Testing Firebase Configuration:
   ✅ Firebase configuration is complete
   🔥 Project ID: my-app-4ba01

═══════════════════════════════════════════════════
📊 SUMMARY:

   Environment Variables: ✅ PASS
   Firebase Config: ✅ PASS
   Groq API (Chat): ✅ PASS
   CoinGecko API (Market): ✅ PASS
   NewsData API (News): ✅ PASS

   Total: 5/5 tests passed
═══════════════════════════════════════════════════

🎉 All API integrations are working correctly!
```

## Running Tests in Production/Staging

For deployed environments:

1. **Set environment variables** in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Render: Dashboard → Environment → Environment Variables

2. **Deploy the application**

3. **Run the test script** pointing to your deployed URL:
   ```bash
   # Modify test-api-integrations.js to use your production URL
   # Change localhost:3000 to your-app.vercel.app
   node test-api-integrations.js
   ```

## Troubleshooting

### All API tests fail with "fetch failed"
- **Cause:** No internet access or network restrictions
- **Solution:** Run tests in an environment with internet access

### Environment variables show "NOT SET"
- **Cause:** `.env.local` file not found or not loaded
- **Solution:** Ensure `.env.local` exists in the project root

### Chat API returns 500 error
- **Cause:** Invalid GROQ_API_KEY or API rate limit exceeded
- **Solution:** Verify API key on Groq console

### CoinGecko API returns 401/403
- **Cause:** Invalid API key or authentication failure
- **Solution:** Check API key on CoinGecko dashboard

### NewsData API returns error
- **Cause:** API key invalid or rate limit exceeded
- **Solution:** Verify API key on NewsData.io dashboard

## Manual Testing

For comprehensive testing, see [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed manual testing instructions.

## Continuous Integration

To integrate these tests into CI/CD:

```yaml
# Example GitHub Actions workflow
name: API Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run dev server
        run: npm run dev &
      - name: Wait for server
        run: sleep 10
      - name: Run API tests
        run: node test-api-integrations.js
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
          NEXT_PUBLIC_COINGECKO_API_KEY: ${{ secrets.COINGECKO_API_KEY }}
          NEXT_PUBLIC_NEWSDATA_API_KEY: ${{ secrets.NEWSDATA_API_KEY }}
```

## Additional Notes

- Tests are safe to run multiple times
- No data is modified during testing
- Tests use read-only API operations
- API rate limits may affect test results

---

**Happy Testing! 🚀**
