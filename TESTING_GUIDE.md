# Testing Guide for Crypto Trading App Features

This guide explains how to test each feature of the Crypto Trading application after deployment.

## Prerequisites

1. Ensure the application is deployed (Vercel, Render, or local development server with internet access)
2. All API keys are configured in the environment variables
3. The application is accessible via a web browser

---

## 🧪 Testing Instructions

### 1. Testing the AI Chat Assistant (Groq API)

**Location:** Main dashboard, Chat section

**Steps to Test:**
1. Navigate to the application homepage
2. Look for the "Chat" or "AI Assistant" section
3. Type a question in the input field, such as:
   - "What is Bitcoin?"
   - "Should I buy Ethereum now?"
   - "Explain cryptocurrency trading strategies"
   - "What are the risks of investing in crypto?"
4. Click "Send" or press Enter
5. Wait for the AI response

**Expected Behavior:**
- The message should appear in the chat window
- Within a few seconds, you should receive an AI-generated response
- The response should be relevant to your question
- The chat should maintain conversation context

**What This Tests:**
- ✅ Groq API integration
- ✅ Chat interface functionality
- ✅ API key authentication
- ✅ Real-time message handling

---

### 2. Testing Market Data (CoinGecko API)

**Location:** Market Overview / Dashboard

**Steps to Test:**
1. Navigate to the main dashboard
2. Look for the "Market Overview" or "Top Cryptocurrencies" section
3. Observe the cryptocurrency listings

**Expected Behavior:**
- You should see a list of top cryptocurrencies (Bitcoin, Ethereum, etc.)
- Each crypto should display:
  - Current price in USD
  - 24h price change (percentage)
  - Market cap
  - Volume
  - Live price charts

**Additional Tests:**
1. Click on a specific cryptocurrency (e.g., Bitcoin)
2. View the detailed chart with historical price data
3. Try different timeframes (24h, 7d, 30d, 90d)
4. Check that the data updates automatically

**What This Tests:**
- ✅ CoinGecko API integration
- ✅ Real-time price fetching
- ✅ Historical data retrieval
- ✅ Chart rendering
- ✅ Data refresh mechanism

---

### 3. Testing News Feature (NewsData API)

**Location:** News section or News Analysis tab

**Steps to Test:**
1. Navigate to the "News" section
2. Look for the latest cryptocurrency news articles

**Expected Behavior:**
- You should see a list of recent crypto news articles
- Each article should show:
  - Title
  - Description/Summary
  - Source
  - Publication date
  - Image (if available)
  - Link to full article

**Additional Tests:**
1. Click on a news article link (should open in new tab)
2. Check that news is relevant to cryptocurrency
3. Verify that news is recent (within the last few days)
4. Look for sentiment indicators if available

**What This Tests:**
- ✅ NewsData API integration
- ✅ News fetching and display
- ✅ Content filtering (crypto-related)
- ✅ UI rendering of news items

---

### 4. Testing Price Prediction Model (TensorFlow.js)

**Location:** Price Prediction section

**Steps to Test:**
1. Navigate to the "Price Prediction" section
2. Select a cryptocurrency from the dropdown
3. Click "Generate Prediction" or similar button

**Expected Behavior:**
- The application should process the historical data
- A prediction chart should appear showing:
  - Historical prices (actual data)
  - Predicted future prices
  - Confidence intervals
- Predictions should be for future timeframes (e.g., next 7 days)

**What This Tests:**
- ✅ TensorFlow.js model loading
- ✅ ML prediction generation
- ✅ Chart visualization of predictions
- ✅ Local computation (no API needed)

---

### 5. Testing Trading Simulator

**Location:** Trading Simulator section

**Steps to Test:**
1. Navigate to the "Trading Simulator" or "Paper Trading" section
2. Select a cryptocurrency to trade
3. Set up a virtual trade:
   - Choose Buy or Sell
   - Enter quantity/amount
   - Set entry price
4. Execute the trade
5. Monitor the virtual portfolio

**Expected Behavior:**
- You should be able to create virtual trades without real money
- The simulator should track:
  - Virtual portfolio balance
  - Open positions
  - Profit/Loss calculations
  - Trade history
- All calculations should be accurate

**What This Tests:**
- ✅ Trading simulation logic
- ✅ Portfolio management
- ✅ P&L calculations
- ✅ Local state management

---

### 6. Testing Technical Analysis

**Location:** Technical Analysis section or chart indicators

**Steps to Test:**
1. Navigate to a cryptocurrency's detailed view
2. Look for technical indicators:
   - RSI (Relative Strength Index)
   - MACD (Moving Average Convergence Divergence)
   - Bollinger Bands
3. Toggle different indicators on/off
4. Change timeframes (1h, 4h, 1d, 1w)

**Expected Behavior:**
- Technical indicators should display correctly on charts
- Indicators should update when changing timeframes
- Values should be mathematically accurate:
  - RSI should be between 0-100
  - MACD should show signal and histogram
  - Bollinger Bands should show upper/lower bands

**What This Tests:**
- ✅ Technical indicators library
- ✅ Chart overlay functionality
- ✅ Calculation accuracy
- ✅ Multiple indicator support

---

## 🔍 Quick Verification Checklist

After deployment, verify these core functionalities:

- [ ] Homepage loads successfully
- [ ] All sections are accessible (Market, News, Chat, Prediction)
- [ ] Chat sends messages and receives AI responses
- [ ] Market data shows current cryptocurrency prices
- [ ] Price charts display and update
- [ ] News articles load and are relevant
- [ ] Price predictions can be generated
- [ ] Trading simulator allows virtual trades
- [ ] Technical indicators display correctly
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive design works

---

## 🐛 Troubleshooting

### Chat Not Responding
- **Check:** Browser console for error messages
- **Verify:** GROQ_API_KEY is set correctly in environment
- **Solution:** Check Groq API dashboard for rate limits or key validity

### Market Data Not Loading
- **Check:** Network tab in browser DevTools
- **Verify:** NEXT_PUBLIC_COINGECKO_API_KEY is set
- **Solution:** CoinGecko free tier has rate limits (30 calls/min)

### News Not Displaying
- **Check:** Console errors
- **Verify:** NEXT_PUBLIC_NEWSDATA_API_KEY is set
- **Solution:** Verify API key is active on NewsData.io dashboard

### Charts Not Rendering
- **Check:** Browser compatibility (use Chrome/Edge/Firefox)
- **Solution:** Clear browser cache and reload

---

## 📊 Performance Testing

To ensure optimal performance:

1. **Load Time:** Homepage should load within 2-3 seconds
2. **Chat Response:** AI responses should arrive within 3-5 seconds
3. **Market Data Refresh:** Real-time data should update every 30-60 seconds
4. **Chart Rendering:** Charts should render smoothly without lag

---

## ✅ Success Criteria

The application is working correctly if:

✅ All API integrations return valid data
✅ No CORS or authentication errors in console
✅ UI is responsive and interactive
✅ Real-time features update automatically
✅ All sections load without errors
✅ Chat provides relevant AI responses
✅ Market data is accurate and current
✅ News articles are recent and relevant

---

## 📝 Testing Logs

Record your testing results:

**Date:** _______________

**Tester:** _______________

| Feature | Status | Notes |
|---------|--------|-------|
| Chat (Groq) | ⬜ Pass / ⬜ Fail | |
| Market Data (CoinGecko) | ⬜ Pass / ⬜ Fail | |
| News (NewsData) | ⬜ Pass / ⬜ Fail | |
| Price Prediction | ⬜ Pass / ⬜ Fail | |
| Trading Simulator | ⬜ Pass / ⬜ Fail | |
| Technical Analysis | ⬜ Pass / ⬜ Fail | |

**Overall Status:** ⬜ All Features Working / ⬜ Some Issues / ⬜ Major Issues

**Additional Comments:**
_______________________________________________________________________________
_______________________________________________________________________________
_______________________________________________________________________________

---

## 🚀 Next Steps After Testing

1. Document any issues found
2. Report bugs via GitHub issues
3. Suggest improvements
4. Monitor API usage and costs
5. Set up alerts for API failures
6. Configure analytics (Firebase Analytics if enabled)

---

**Happy Testing! 🎉**

---

## 🔍 Testing the Analysis Endpoint (New)

### Command-Line Verification

We've added a verification script to test the `/api/crypto/analysis/[id]` endpoint which provides technical analysis data.

**Prerequisites:**
- Node.js installed
- The application running (either locally via `npm run dev` or deployed)

**Steps to Test:**

1. **Test against local development server:**
   ```bash
   # Start the dev server if not already running
   npm run dev
   
   # In another terminal, run the verification script
   node scripts/verify-analysis.js bitcoin http://localhost:3000
   ```

2. **Test against deployed production server:**
   ```bash
   node scripts/verify-analysis.js ethereum https://crypto-trading-teal.vercel.app
   ```

3. **Test with different coins and timeframes:**
   ```bash
   # Test with different cryptocurrency IDs
   node scripts/verify-analysis.js bitcoin http://localhost:3000
   node scripts/verify-analysis.js ethereum http://localhost:3000
   node scripts/verify-analysis.js cardano http://localhost:3000
   
   # Test with different day ranges (optional third parameter, default is 90)
   node scripts/verify-analysis.js bitcoin http://localhost:3000 30
   node scripts/verify-analysis.js bitcoin http://localhost:3000 365
   ```

**Expected Output:**

✅ **Success Response (HTTP 200):**
```
============================================================
Crypto Analysis Endpoint Verification
============================================================
URL: http://localhost:3000/api/crypto/analysis/bitcoin?days=90
Coin: bitcoin
Days: 90
============================================================

Status: 200 OK
Duration: 1234ms

Headers:
  content-type: application/json
  ...

✅ SUCCESS

Response Summary:
  Price Points: 90

Indicators:
  RSI: 58.32
  MACD Line: 123.45
  Signal Line: 98.76
  Histogram: 24.69
  BB Upper: 42500.12
  BB Middle: 40000.00
  BB Lower: 37500.88
  MA20: 41000.23
  MA50: 39500.45
  MA200: 38000.67
...
```

❌ **Error Response (HTTP 502/500):**
```
Status: 502 Bad Gateway
...

❌ ERROR

Error Response:
{
  "error": "Failed to fetch price history",
  "message": "Unable to retrieve data from upstream API",
  "details": {
    "id": "bitcoin",
    "message": "CoinGecko API key is not configured"
  }
}
```

**What This Tests:**
- ✅ Analysis endpoint availability
- ✅ Retry logic for upstream API failures
- ✅ Error handling and informative error messages
- ✅ Response structure validation
- ✅ Technical indicator calculations
- ✅ Development mode diagnostics

**Common Issues and Solutions:**

1. **"CoinGecko API key is not configured"**
   - Solution: Set the `COINGECKO_API_KEY` or `NEXT_PUBLIC_COINGECKO_API_KEY` environment variable

2. **Connection refused / Server not running**
   - Solution: Make sure the dev server is running with `npm run dev`

3. **502 Bad Gateway in production**
   - This may indicate:
     - Rate limiting from CoinGecko API
     - Network connectivity issues
     - Upstream API is down
   - Check Vercel logs for detailed error information

4. **Indicators showing NaN or invalid values**
   - Ensure sufficient price data is available (minimum 26 data points)
   - Check that the cryptocurrency ID is valid

### Browser Testing

You can also test the endpoint directly in the browser or using browser dev tools:

1. **Open the application in a browser**
2. **Open Developer Console (F12)**
3. **Navigate to a cryptocurrency detail page**
4. **Check the Network tab for `/api/crypto/analysis/[id]` requests**
5. **Look for:**
   - Response status (should be 200 for success)
   - Response body containing `prices` and `indicators`
   - Error messages in console if something fails
   - Retry button appears on errors (for frontend testing)

**Expected Frontend Behavior:**

✅ **Success:**
- Technical analysis chart displays with price data
- Indicator values show in the UI (RSI, MACD, Bollinger Bands, Moving Averages)
- Signals panel shows bullish/bearish indicators

❌ **Error:**
- User-friendly error message displays
- "Retry" button appears
- In development mode, error details are visible
- No blank or broken chart is shown

---
