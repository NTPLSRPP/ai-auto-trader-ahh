# Passive Income Ahh

[![GitHub stars](https://img.shields.io/github/stars/LynchzDEV/ai-auto-trader-ahh?style=social)](https://github.com/LynchzDEV/ai-auto-trader-ahh/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/LynchzDEV/ai-auto-trader-ahh?style=social)](https://github.com/LynchzDEV/ai-auto-trader-ahh/network/members)
[![GitHub issues](https://img.shields.io/github/issues/LynchzDEV/ai-auto-trader-ahh)](https://github.com/LynchzDEV/ai-auto-trader-ahh/issues)
[![GitHub contributors](https://img.shields.io/github/contributors/LynchzDEV/ai-auto-trader-ahh)](https://github.com/LynchzDEV/ai-auto-trader-ahh/graphs/contributors)
[![GitHub license](https://img.shields.io/github/license/LynchzDEV/ai-auto-trader-ahh)](https://github.com/LynchzDEV/ai-auto-trader-ahh/blob/main/LICENSE)

AI-powered cryptocurrency futures trading platform with multi-AI debate consensus, backtesting, and real-time portfolio management.

## Features

- **Multi-AI Debate**: Multiple AI personalities analyze markets and reach consensus
- **Backtesting**: Test strategies against historical data with detailed metrics
- **Real-time Trading**: Automated execution on Binance Futures
- **Risk Management**: Stop-loss, take-profit, leverage controls
- **Modern Dashboard**: Glassmorphism UI with real-time updates

## Quick Start

### Prerequisites

- Go 1.21+
- Node.js 18+
- Binance Futures account (testnet recommended)
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd passive-income-ahh
   ```

2. **Setup Backend**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your API keys
   go build -o server .
   ./server
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access Dashboard**
   - Frontend: http://localhost:5173
   - API: http://localhost:8080

## Configuration

Edit `server/.env`:

```bash
# AI Configuration
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=deepseek/deepseek-chat

# Binance Configuration
BINANCE_API_KEY=your-binance-key
BINANCE_SECRET_KEY=your-binance-secret
BINANCE_TESTNET=true  # Use testnet for testing!

# Server
API_PORT=8080
```

## Project Structure

```
passive-income-ahh/
├── server/          # Go backend (API, trading engine, AI)
├── client/          # React frontend (Vite + TypeScript)
├── CLAUDE.md        # AI assistant context
└── README.md        # This file
```

## Screenshots

*Dashboard with real-time positions and AI decisions*

## Tech Stack

**Backend:**
- Go 1.21
- Gin (HTTP framework)
- SQLite (database)
- OpenRouter (AI providers)
- Binance Futures API

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Framer Motion
- Recharts

## Documentation

- [Server README](./server/README.md) - Backend setup and API documentation
- [Client README](./client/README.md) - Frontend setup and development
- [CLAUDE.md](./CLAUDE.md) - AI assistant context for development

## Disclaimer

This software is for educational purposes only. Cryptocurrency trading involves substantial risk of loss. Use at your own risk and never trade with money you cannot afford to lose.

## License

MIT
