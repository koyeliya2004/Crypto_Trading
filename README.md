# AI CryptoMentor - Cryptocurrency Trading Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)

A comprehensive, AI-powered dashboard for cryptocurrency trading analysis, market overview, and intelligent trading assistance. This application provides real-time data visualization, technical analysis, and AI-driven insights to help traders make informed decisions.

## 🚀 Features

### Market Analysis
- **Real-time Cryptocurrency Price Tracking**: Monitor live price movements of top cryptocurrencies
- **Interactive Price Charts**: Visualize historical price data with customizable timeframes
- **Market Overview Dashboard**: Get a bird's-eye view of the entire crypto market
- **Technical Analysis Tools**: Access key indicators like RSI, MACD, and Bollinger Bands

### AI-Powered Insights
- **Price Prediction Models**: ML-based forecasting of potential price movements
- **Sentiment Analysis**: Gauge market sentiment from news and social media
- **Risk Assessment**: Evaluate potential risks for different trading strategies
- **Trading Signals**: Receive buy/sell recommendations based on technical indicators

### Trading Tools
- **Trading Simulator**: Practice strategies without risking real capital
- **Portfolio Tracker**: Monitor your crypto holdings and performance
- **AI Trading Assistant**: Get personalized trading advice and strategy recommendations
- **News Analysis**: Stay updated with relevant crypto news and their potential market impact

## 📸 Screenshots

![Market Overview Dashboard](./screenshots/Screenshot%202025-04-02%20225324.png)

![Technical Analysis Tools](./screenshots/Screenshot%202025-04-02%20225401.png)

![AI Trading Assistant](./screenshots/Screenshot%202025-04-02%20225446.png)

![Additional Dashboard View](./screenshots/Screenshot%202025-04-02%20231830.png)

![Portfolio Analysis](./screenshots/Screenshot%202025-04-02%20231901.png)

## 🛠️ Technologies

### Frontend
- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript for robust code
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Shadcn UI**: Component library for modern UI elements
- **Lightweight Charts**: High-performance financial charting library
- **Recharts**: Composable charting library for data visualization

### AI & Data Analysis
- **TensorFlow.js**: Machine learning library for predictive models
- **Technical Indicators**: Library for financial technical analysis
- **Groq API**: Fast AI inference for the trading assistant chatbot

### APIs
- **CoinGecko API**: Comprehensive cryptocurrency market data
- **NewsData API**: Real-time crypto news and market sentiment analysis
- **Binance WebSocket**: Live cryptocurrency price streaming

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn package manager
- API keys for CoinGecko and other services

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankit-Basu/Crypto_Trading_Dashboard.git
   cd Crypto_Trading_Dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   GROQ_API_KEY=your_groq_api_key
   COINGECKO_API_KEY=your_coingecko_api_key
   NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
   NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
   ```
   
   For Firebase integration (optional):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```
   
   See `.env.example` for a template.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application

## 🚀 Usage

### Dashboard Navigation

The application is divided into several key sections:

- **Home**: Overview of the platform and key metrics
- **Market**: Detailed market data, charts, and technical analysis
- **News**: Latest cryptocurrency news and sentiment analysis
- **Chat**: AI trading assistant for personalized advice

### Analyzing Cryptocurrencies

1. Select a cryptocurrency from the Market Overview section
2. View detailed price charts and technical indicators
3. Check AI-generated price predictions and risk analysis
4. Use the trading simulator to test strategies

### Getting AI Assistance

1. Navigate to the Chat section
2. Ask questions about trading strategies, market conditions, or specific cryptocurrencies
3. Receive personalized recommendations and insights

## 🏗️ Project Structure

```
/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── lib/              # Utility functions and API clients
│   ├── types/            # TypeScript type definitions
│   └── page.tsx          # Main page component
├── components/           # Shared UI components
│   └── ui/               # Shadcn UI components
├── public/               # Static assets
│   └── images/           # Image assets
└── styles/               # Global styles
```

## 🔄 API Integrations

The dashboard integrates with several external APIs:

- **CoinGecko API**: For cryptocurrency market data, prices, and historical charts
- **NewsData API**: For aggregating relevant cryptocurrency news and sentiment analysis
- **Groq API**: For AI-powered trading assistance and natural language processing
- **Firebase** (Optional): For authentication, analytics, and cloud storage

### Testing API Integrations

To test all API integrations:

```bash
# Ensure dev server is running
npm run dev

# In a new terminal, run the test script
node test-api-integrations.js
```

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md) and [RUN_TESTS.md](./RUN_TESTS.md).

For a comprehensive API integration report, see [API_INTEGRATION_REPORT.md](./API_INTEGRATION_REPORT.md).

## 🧪 Testing

Run the test suite with:

```bash
npm run test
# or
yarn test
```

## 🚢 Deployment

### Live Demo

Check out the live application deployed on Vercel:
[https://crypto-trading-dashboard-oj6zw56cc.vercel.app](https://crypto-trading-dashboard-oj6zw56cc.vercel.app)

### Building for Production

```bash
npm run build
# or
yarn build
```

### Deploying to Vercel

The easiest way to deploy this application is using Vercel:

```bash
npx vercel --prod
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

**Disclaimer**: This application is for informational purposes only and should not be considered financial advice. Always do your own research before making investment decisions.
