# Passive Income Ahh - Server

Go backend for the AI-powered trading platform.

## Architecture

```
server/
├── ai/            # Legacy OpenRouter client
├── api/           # HTTP API (Gin framework)
├── backtest/      # Backtesting engine
├── config/        # Configuration loading
├── data/          # SQLite database storage
├── debate/        # Multi-AI debate system
├── decision/      # AI decision engine
├── exchange/      # Binance Futures API client
├── main.go        # Entry point
├── market/        # Market data & indicators
├── mcp/           # Multi-provider AI client
├── store/         # Database models
└── trader/        # Trading engine
```

## Quick Start

```bash
# Install dependencies
go mod download

# Copy and configure environment
cp .env.example .env
# Edit .env with your API keys

# Build
go build -o server .

# Run
./server
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |
| `OPENROUTER_MODEL` | AI model (e.g., `deepseek/deepseek-chat`) | Yes |
| `BINANCE_API_KEY` | Binance Futures API key | Yes |
| `BINANCE_SECRET_KEY` | Binance Futures secret | Yes |
| `BINANCE_TESTNET` | Use testnet (`true`/`false`) | No (default: `true`) |
| `API_PORT` | Server port | No (default: `8080`) |
| `LEVERAGE` | Default leverage | No (default: `5`) |
| `TRADING_INTERVAL` | Minutes between AI cycles | No (default: `5`) |

## API Endpoints

### Health
```
GET /api/health
```

### Traders
```
GET    /api/traders           # List all traders
POST   /api/traders           # Create trader
POST   /api/traders/{id}/start # Start trader
POST   /api/traders/{id}/stop  # Stop trader
GET    /api/status            # Get trader status
GET    /api/positions         # Get positions
GET    /api/decisions         # Get AI decisions
```

### Strategies
```
GET    /api/strategies        # List strategies
POST   /api/strategies        # Create strategy
```

### Backtesting
```
GET    /api/backtest          # List backtests
POST   /api/backtest/start    # Start backtest
GET    /api/backtest/{id}     # Get backtest details
```

### Debate
```
GET    /api/debate/sessions   # List debate sessions
POST   /api/debate/sessions   # Create debate session
GET    /api/debate/sessions/{id}/events  # SSE stream
```

## AI Integration

### Supported Providers (via OpenRouter)
- DeepSeek (recommended, cost-effective)
- OpenAI GPT-4
- Anthropic Claude
- Meta Llama
- And more...

### Decision Format

AI responses use NOFX-style XML tags:

```xml
<reasoning>
Market analysis and thinking process...
</reasoning>

<decision>
```json
[
  {
    "symbol": "BTCUSDT",
    "action": "open_long",
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

### Action Types
- `open_long` - Open long position
- `open_short` - Open short position
- `close_long` - Close long position
- `close_short` - Close short position
- `hold` - Hold current position
- `wait` - No action

## Database

SQLite database stored in `data/trading.db`:

- **traders** - Trader configurations
- **strategies** - Trading strategies
- **decisions** - AI decision history
- **positions** - Position tracking
- **backtests** - Backtest results

## Development

```bash
# Run with hot reload (requires air)
air

# Run tests
go test ./...

# Build for production
CGO_ENABLED=1 go build -o server .
```

## Binance Testnet

For testing, use Binance Futures Testnet:
1. Go to https://testnet.binancefuture.com
2. Create account and get test USDT
3. Generate API keys
4. Set `BINANCE_TESTNET=true` in `.env`
