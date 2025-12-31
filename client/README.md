# Passive Income Ahh - Client

React frontend for the AI-powered trading platform.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Recharts** - Charts
- **React Router** - Navigation
- **Lucide Icons** - Icons

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
client/
├── public/
│   └── icon.svg           # App icon
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   └── Layout.tsx    # Main layout with sidebar
│   ├── lib/
│   │   ├── api.ts        # API client
│   │   └── utils.ts      # Utilities
│   ├── pages/
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── Backtest.tsx  # Backtesting UI
│   │   ├── Debate.tsx    # AI debate arena
│   │   ├── Equity.tsx    # Equity charts
│   │   ├── History.tsx   # Trade history
│   │   ├── Strategies.tsx # Strategy management
│   │   ├── Config.tsx    # API configuration
│   │   └── Logs.tsx      # Decision logs
│   ├── App.tsx           # Routes
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template with SEO
└── vite.config.ts        # Vite configuration
```

## Pages

### Dashboard
- Real-time trader status
- Position monitoring
- Quick actions (start/stop traders)
- AI decision feed

### Backtest
- Configure backtest parameters
- Run historical simulations
- View equity curves
- Performance metrics

### Debate Arena
- Create multi-AI debate sessions
- Watch AI personalities discuss markets
- View consensus decisions
- Real-time message streaming (SSE)

### Equity
- Portfolio equity charts
- Time range selection
- Daily returns visualization

### History
- Complete trade log
- Filter by symbol, side, date
- View AI reasoning for each trade

### Strategies
- Create/edit trading strategies
- Risk parameter configuration
- AI model selection

### Config
- API key management
- Exchange configuration
- System settings

## Design System

### Theme
- Dark-only glassmorphism design
- Primary: Blue/Purple gradient
- Background: `#0a0a0f`
- Glass effects with blur/opacity

### CSS Classes
```css
.glass-card       /* Glassmorphism card */
.glass-sidebar    /* Sidebar with glass effect */
.glow-border      /* Animated glow border */
.glow-primary     /* Primary color glow */
.text-gradient    /* Gradient text effect */
.pulse-live       /* Live indicator pulse */
```

### Animation
- Framer Motion for page transitions
- Fade animations for loading states
- Number tickers for live data

## API Integration

API client in `src/lib/api.ts`:

```typescript
import * as api from '@/lib/api';

// Health check
await api.checkHealth();

// Traders
const traders = await api.getTraders();
await api.createTrader({ ... });
await api.startTrader(id);
await api.stopTrader(id);

// Backtests
await api.startBacktest({ ... });
const backtests = await api.getBacktests();

// Debates
await api.createDebateSession({ ... });
const sessions = await api.getDebateSessions();
```

## Environment

The client connects to the backend at `http://localhost:8080` by default.

To change the API URL, update `src/lib/api.ts`:

```typescript
const API_BASE = 'http://localhost:8080/api';
```

## Development

```bash
# Install new component (shadcn/ui)
npx shadcn@latest add <component-name>

# Format code
npm run format

# Lint
npm run lint
```

## Building for Production

```bash
# Build
npm run build

# Output in dist/ folder
# Serve with any static file server
```
