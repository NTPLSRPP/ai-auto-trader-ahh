// Mock data for UI development without API keys
import type { Strategy, Trader, Position } from "../types";

export const mockStrategies: Strategy[] = [
  {
    id: "strategy-1",
    name: "Momentum Breakout",
    description:
      "High-frequency momentum trading with multi-timeframe confirmation",
    is_active: true,
    config: {
      coin_source: {
        source_type: "static",
        static_coins: ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
      },
      indicators: {
        primary_timeframe: "15m",
        kline_count: 100,
        enable_ema: true,
        enable_macd: true,
        enable_rsi: true,
        enable_atr: true,
        enable_boll: false,
        enable_volume: true,
        ema_periods: [9, 21, 55],
        rsi_period: 14,
        atr_period: 14,
        boll_period: 20,
        macd_fast: 12,
        macd_slow: 26,
        macd_signal: 9,
      },
      risk_control: {
        max_positions: 3,
        max_leverage: 10,
        max_position_percent: 15,
        max_margin_usage: 50,
        min_position_usd: 50,
        min_confidence: 65,
        min_risk_reward_ratio: 2.5,
      },
      ai: { enable_reasoning: true, reasoning_model: "deepseek/deepseek-chat" },
      custom_prompt: "",
      trading_interval: 300,
      turbo_mode: false,
    },
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "strategy-2",
    name: "Scalper Pro",
    description: "Quick scalping strategy for volatile markets",
    is_active: false,
    config: {
      coin_source: { source_type: "static", static_coins: ["BTCUSDT"] },
      indicators: {
        primary_timeframe: "5m",
        kline_count: 50,
        enable_ema: true,
        enable_macd: false,
        enable_rsi: true,
        enable_atr: true,
        enable_boll: true,
        enable_volume: false,
        ema_periods: [5, 13],
        rsi_period: 7,
        atr_period: 10,
        boll_period: 20,
        macd_fast: 12,
        macd_slow: 26,
        macd_signal: 9,
      },
      risk_control: {
        max_positions: 1,
        max_leverage: 20,
        max_position_percent: 10,
        max_margin_usage: 30,
        min_position_usd: 100,
        min_confidence: 75,
        min_risk_reward_ratio: 1.5,
      },
      ai: { enable_reasoning: false, reasoning_model: "" },
      custom_prompt: "",
      trading_interval: 60,
      turbo_mode: true,
    },
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockTraders: Trader[] = [
  {
    id: "trader-1",
    name: "Alpha Bot",
    strategy_id: "strategy-1",
    exchange: "binance",
    status: "running",
    initial_balance: 1000,
    config: {
      ai_provider: "openrouter",
      ai_model: "deepseek/deepseek-chat",
      api_key: "***hidden***",
      secret_key: "***hidden***",
      testnet: true,
    },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trader-2",
    name: "Beta Scalper",
    strategy_id: "strategy-2",
    exchange: "binance",
    status: "stopped",
    initial_balance: 500,
    config: {
      ai_provider: "openrouter",
      ai_model: "anthropic/claude-3.5-sonnet",
      api_key: "***hidden***",
      secret_key: "***hidden***",
      testnet: true,
    },
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockPositions: Position[] = [
  {
    symbol: "BTCUSDT",
    side: "LONG",
    amount: 0.025,
    entry_price: 97850.5,
    mark_price: 98320.25,
    pnl: 11.74,
    pnl_percent: 2.42,
    leverage: 10,
  },
  {
    symbol: "ETHUSDT",
    side: "SHORT",
    amount: -0.5,
    entry_price: 3450.0,
    mark_price: 3380.5,
    pnl: 34.75,
    pnl_percent: 4.02,
    leverage: 5,
  },
  {
    symbol: "SOLUSDT",
    side: "LONG",
    amount: 10,
    entry_price: 185.2,
    mark_price: 182.8,
    pnl: -24.0,
    pnl_percent: -1.3,
    leverage: 8,
  },
];

export const mockAccountInfo = {
  wallet_balance: 10542.85,
  total_equity: 10565.34,
  available: 8234.5,
  unrealized_pnl: 22.49,
};

export const mockStatus = {
  running: true,
  last_update: new Date().toISOString(),
  decisions: {
    BTCUSDT: {
      action: "BUY",
      confidence: 78,
      current_price: 98320.25,
      reasoning:
        "Strong bullish momentum detected. EMA crossover confirmed with RSI showing oversold bounce. Volume surge indicates institutional buying pressure.",
    },
    ETHUSDT: {
      action: "HOLD",
      confidence: 52,
      current_price: 3380.5,
      reasoning:
        "Consolidating in range. Waiting for clearer directional signal. MACD histogram showing decreasing bearish momentum.",
    },
    SOLUSDT: {
      action: "SELL",
      confidence: 71,
      current_price: 182.8,
      reasoning:
        "Breaking below key support level. RSI divergence indicates weakening bullish structure. Recommend closing long position.",
    },
    AVAXUSDT: {
      action: "BUY",
      confidence: 65,
      current_price: 42.35,
      reasoning:
        "Bounce from 200 EMA with increasing volume. Risk/reward favorable for long entry with tight stop loss.",
    },
  },
};

export const mockEquityHistory = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const baseEquity = 10000;
  const variation = Math.sin(i * 0.3) * 500 + Math.random() * 200;
  return {
    timestamp: date.toISOString(),
    equity: baseEquity + variation + i * 20,
    balance: baseEquity + variation * 0.8 + i * 18,
  };
});

export const mockTrades = [
  {
    id: 1,
    trader_id: "trader-1",
    symbol: "BTCUSDT",
    side: "BUY",
    price: 96500.0,
    quantity: 0.02,
    quote_qty: 1930.0,
    realized_pnl: 14.0,
    commission: 0.77,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    order_id: 12345001,
  },
  {
    id: 2,
    trader_id: "trader-1",
    symbol: "ETHUSDT",
    side: "SELL",
    price: 3520.0,
    quantity: 0.8,
    quote_qty: 2816.0,
    realized_pnl: 32.0,
    commission: 1.12,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    order_id: 12345002,
  },
  {
    id: 3,
    trader_id: "trader-1",
    symbol: "SOLUSDT",
    side: "BUY",
    price: 178.5,
    quantity: 5,
    quote_qty: 892.5,
    realized_pnl: -31.5,
    commission: 0.35,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    order_id: 12345003,
  },
];

// Backtest trades have a different structure than live trades
export const mockBacktestTrades = [
  {
    timestamp: new Date("2024-02-15").toISOString(),
    symbol: "BTCUSDT",
    side: "LONG",
    entry_price: 42500.0,
    exit_price: 44200.0,
    pnl: 170.0,
    pnl_percent: 4.0,
  },
  {
    timestamp: new Date("2024-03-10").toISOString(),
    symbol: "ETHUSDT",
    side: "SHORT",
    entry_price: 2800.0,
    exit_price: 2650.0,
    pnl: 107.14,
    pnl_percent: 5.36,
  },
  {
    timestamp: new Date("2024-04-05").toISOString(),
    symbol: "BTCUSDT",
    side: "LONG",
    entry_price: 65000.0,
    exit_price: 63500.0,
    pnl: -115.38,
    pnl_percent: -2.31,
  },
];

export const mockBacktests = [
  {
    run_id: "backtest-1",
    strategy_id: "strategy-1",
    status: "completed",
    config: {
      symbols: ["BTCUSDT", "ETHUSDT"],
      initial_balance: 10000,
      start_ts: new Date("2024-01-01").getTime(),
      end_ts: new Date("2024-06-30").getTime(),
    },
    started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    current_equity: 14250,
    progress: 100,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    run_id: "backtest-2",
    strategy_id: "strategy-2",
    status: "running",
    config: {
      symbols: ["SOLUSDT"],
      initial_balance: 5000,
      start_ts: new Date("2024-03-01").getTime(),
      end_ts: new Date("2024-12-31").getTime(),
    },
    started_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    completed_at: "",
    current_equity: 5320,
    progress: 67,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockSettings = {
  openrouter_api_key: "",
  openrouter_model: "deepseek/deepseek-chat",
  binance_api_key: "",
  binance_secret_key: "",
  binance_testnet: true,
};

export const mockDebateSessions = [
  {
    id: "debate-1",
    name: "Morning Analysis",
    status: "completed",
    symbols: ["BTCUSDT", "ETHUSDT"],
    max_rounds: 3,
    current_round: 3,
    participants: [
      { id: "p1", ai_model_name: "DeepSeek V3.2", personality: "bull" },
      { id: "p2", ai_model_name: "GPT-4.1 Nano", personality: "bear" },
      { id: "p3", ai_model_name: "Gemini 2.5 Flash", personality: "analyst" },
    ],
    messages: [
      {
        id: "m1",
        round: 1,
        ai_model_name: "DeepSeek V3.2",
        personality: "bull",
        message_type: "argument",
        content:
          "BTC showing strong support at $97k with increasing volume. The EMA crossover indicates bullish momentum.",
        confidence: 78,
        created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: "m2",
        round: 1,
        ai_model_name: "GPT-4.1 Nano",
        personality: "bear",
        message_type: "argument",
        content:
          "Resistance at $99k is significant. RSI approaching overbought territory suggests caution.",
        confidence: 65,
        created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      },
    ],
    votes: [
      { participant_id: "p1", action: "BUY", confidence: 80 },
      { participant_id: "p2", action: "HOLD", confidence: 55 },
      { participant_id: "p3", action: "BUY", confidence: 72 },
    ],
    final_decisions: [
      { symbol: "BTCUSDT", action: "BUY", confidence: 76 },
      { symbol: "ETHUSDT", action: "HOLD", confidence: 58 },
    ],
    auto_cycle: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];
