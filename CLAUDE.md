# Passive Income Ahh - AI-Powered Trading Platform

## Project Overview

Passive Income Ahh is an AI-powered cryptocurrency futures trading platform built with Go (backend) and React (frontend). It integrates with OpenRouter for AI decision-making and Binance Futures for trade execution.

## Project Structure

```
passive-income-ahh/
├── server/                 # Go backend
│   ├── ai/                # Legacy OpenRouter client
│   ├── api/               # HTTP API server (Gin framework)
│   ├── backtest/          # Backtesting engine
│   ├── config/            # Configuration management
│   ├── data/              # SQLite database
│   ├── debate/            # Multi-AI debate system
│   ├── decision/          # AI decision engine (NOFX-style)
│   ├── exchange/          # Binance API client
│   ├── main.go            # Entry point
│   ├── market/            # Market data fetching
│   ├── mcp/               # Multi-provider AI client
│   ├── store/             # Database models
│   └── trader/            # Trading engine
│
└── client/                # React frontend
    ├── src/
    │   ├── components/    # UI components
    │   ├── lib/           # API client, utilities
    │   └── pages/         # Page components
    └── public/            # Static assets
```

## Key Features

### Multi-AI Debate System
- Multiple AI personalities analyze markets simultaneously
- Personalities: Bull, Bear, Analyst, Contrarian, Risk Manager
- Consensus voting for final trading decisions
- Uses `<reasoning>` and `<decision>` XML tags (NOFX-style)

### Backtesting
- Historical strategy testing with real market data
- Equity curve visualization
- Performance metrics: PnL, Win Rate, Sharpe Ratio

### Trading Engine
- Real-time position management
- Risk controls: max leverage, stop-loss, take-profit
- Support for multiple AI models via OpenRouter

## AI Decision Format

All AI responses follow NOFX-style format:

```xml
<reasoning>
Analysis and thinking process...
</reasoning>

<decision>
```json
[
  {
    "symbol": "BTCUSDT",
    "action": "open_long|open_short|close_long|close_short|hold|wait",
    "leverage": 5,
    "position_size_usd": 1000,
    "stop_loss": 42000,
    "take_profit": 48000,
    "confidence": 85,
    "reasoning": "Detailed reasoning"
  }
]
```
</decision>
```

## Development

### Backend (Go)
```bash
cd server
go build -o server .
./server
```

### Frontend (React)
```bash
cd client
npm install
npm run dev
```

### Environment Variables
Copy `server/.env.example` to `server/.env`:
```bash
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=deepseek/deepseek-chat
BINANCE_API_KEY=...
BINANCE_SECRET_KEY=...
BINANCE_TESTNET=true
API_PORT=8080
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/traders | List traders |
| POST | /api/traders | Create trader |
| POST | /api/traders/{id}/start | Start trader |
| POST | /api/traders/{id}/stop | Stop trader |
| GET | /api/strategies | List strategies |
| POST | /api/strategies | Create strategy |
| GET | /api/backtest | List backtests |
| POST | /api/backtest/start | Start backtest |
| GET | /api/debate/sessions | List debates |
| POST | /api/debate/sessions | Create debate |

## Code Style

- **Go**: Standard Go formatting, error wrapping with context
- **React**: TypeScript, functional components, TailwindCSS
- **AI Prompts**: Use XML tags for structured output
- **Database**: SQLite with GORM-style models

## Important Files

- `server/debate/engine.go` - Multi-AI debate system
- `server/decision/prompt_builder.go` - AI prompt construction
- `server/trader/engine.go` - Core trading loop
- `client/src/pages/Dashboard.tsx` - Main dashboard
- `client/src/pages/Debate.tsx` - Debate arena UI
- `client/src/pages/Backtest.tsx` - Backtesting UI
