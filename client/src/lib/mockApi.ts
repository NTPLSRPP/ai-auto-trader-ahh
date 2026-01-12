// Mock API wrapper - intercepts API calls when VITE_USE_MOCK=true
import {
  mockStrategies,
  mockTraders,
  mockPositions,
  mockAccountInfo,
  mockStatus,
  mockEquityHistory,
  mockTrades,
  mockBacktestTrades,
  mockBacktests,
  mockSettings,
  mockDebateSessions,
} from "./mockData";

// Check if mock mode is enabled
export const isMockMode = import.meta.env.VITE_USE_MOCK === "true";

// Simulate network delay for realistic testing
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock response wrapper to match axios response format
const mockResponse = <T>(data: T) => ({ data, status: 200, statusText: "OK" });

// In-memory state for mock data mutations
let _traders = [...mockTraders];
let _strategies = [...mockStrategies];
let _backtests = [...mockBacktests];

// Reset mock state (useful for testing)
export const resetMockState = () => {
  _traders = [...mockTraders];
  _strategies = [...mockStrategies];
  _backtests = [...mockBacktests];
};

// Mock API implementations
export const mockApi = {
  // Auth
  verifyPasskey: async (_passkey: string) => {
    await delay(200);
    // Return valid: true and required: false to bypass auth in mock mode
    return mockResponse({
      valid: true,
      required: false,
      message: "Passkey verified",
    });
  },

  // Health
  getHealth: async () => {
    await delay(100);
    return mockResponse({ status: "ok", mock: true });
  },

  // Strategies
  getStrategies: async () => {
    await delay();
    return mockResponse({ strategies: _strategies });
  },

  getStrategy: async (id: string) => {
    await delay();
    const strategy = _strategies.find((s) => s.id === id);
    return mockResponse(strategy || null);
  },

  createStrategy: async (data: any) => {
    await delay();
    const newStrategy = {
      id: `strategy-${Date.now()}`,
      ...data,
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    _strategies.push(newStrategy);
    return mockResponse(newStrategy);
  },

  updateStrategy: async (id: string, data: any) => {
    await delay();
    const index = _strategies.findIndex((s) => s.id === id);
    if (index >= 0) {
      _strategies[index] = {
        ..._strategies[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return mockResponse(_strategies[index]);
    }
    throw new Error("Strategy not found");
  },

  deleteStrategy: async (id: string) => {
    await delay();
    _strategies = _strategies.filter((s) => s.id !== id);
    return mockResponse({ success: true });
  },

  activateStrategy: async (id: string) => {
    await delay();
    _strategies = _strategies.map((s) => ({
      ...s,
      is_active: s.id === id,
    }));
    return mockResponse({ success: true });
  },

  getDefaultConfig: async () => {
    await delay();
    return mockResponse(mockStrategies[0]?.config || {});
  },

  recommendPairs: async () => {
    await delay(500);
    return mockResponse({
      pairs: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "AVAXUSDT", "LINKUSDT"],
      reasoning: "Selected based on volume and volatility analysis",
    });
  },

  // Traders
  getTraders: async () => {
    await delay();
    return mockResponse({ traders: _traders });
  },

  getTrader: async (id: string) => {
    await delay();
    const trader = _traders.find((t) => t.id === id);
    return mockResponse(trader || null);
  },

  createTrader: async (data: any) => {
    await delay();
    const newTrader = {
      id: `trader-${Date.now()}`,
      ...data,
      status: "stopped" as const,
      created_at: new Date().toISOString(),
    };
    _traders.push(newTrader);
    return mockResponse(newTrader);
  },

  updateTrader: async (id: string, data: any) => {
    await delay();
    const index = _traders.findIndex((t) => t.id === id);
    if (index >= 0) {
      _traders[index] = { ..._traders[index], ...data };
      return mockResponse(_traders[index]);
    }
    throw new Error("Trader not found");
  },

  deleteTrader: async (id: string) => {
    await delay();
    _traders = _traders.filter((t) => t.id !== id);
    return mockResponse({ success: true });
  },

  startTrader: async (id: string) => {
    await delay();
    const index = _traders.findIndex((t) => t.id === id);
    if (index >= 0) {
      _traders[index] = { ..._traders[index], status: "running" as const };
      return mockResponse({ success: true });
    }
    throw new Error("Trader not found");
  },

  stopTrader: async (id: string) => {
    await delay();
    const index = _traders.findIndex((t) => t.id === id);
    if (index >= 0) {
      _traders[index] = { ..._traders[index], status: "stopped" as const };
      return mockResponse({ success: true });
    }
    throw new Error("Trader not found");
  },

  // Data APIs
  getStatus: async (_traderId: string) => {
    await delay();
    return mockResponse(mockStatus);
  },

  getAccount: async (_traderId: string) => {
    await delay();
    return mockResponse(mockAccountInfo);
  },

  getPositions: async (_traderId: string) => {
    await delay();
    return mockResponse({ positions: mockPositions });
  },

  getDecisions: async (_traderId: string) => {
    await delay();
    return mockResponse({
      decisions: Object.entries(mockStatus.decisions).map(([symbol, dec]) => ({
        symbol,
        ...dec,
      })),
    });
  },

  getTrades: async (_traderId: string) => {
    await delay();
    return mockResponse({ trades: mockTrades });
  },

  getEquityHistory: async (_traderId: string) => {
    await delay();
    return mockResponse({ history: mockEquityHistory });
  },

  // Backtest
  listBacktests: async () => {
    await delay();
    return mockResponse({ backtests: _backtests });
  },

  startBacktest: async (data: any) => {
    await delay();
    const newBacktest = {
      run_id: `backtest-${Date.now()}`,
      strategy_id: data.strategy_id,
      status: "running",
      config: {
        symbols: data.symbols || ["BTCUSDT"],
        initial_balance: data.initial_capital || 10000,
        start_ts: data.start_date
          ? new Date(data.start_date).getTime()
          : Date.now(),
        end_ts: data.end_date ? new Date(data.end_date).getTime() : Date.now(),
      },
      started_at: new Date().toISOString(),
      completed_at: "",
      current_equity: data.initial_capital || 10000,
      progress: 0,
      created_at: new Date().toISOString(),
    };
    _backtests.push(newBacktest);
    return mockResponse(newBacktest);
  },

  stopBacktest: async (runId: string) => {
    await delay();
    _backtests = _backtests.map((b) =>
      b.run_id === runId ? { ...b, status: "stopped" } : b
    );
    return mockResponse({ success: true });
  },

  getBacktestStatus: async (runId: string) => {
    await delay();
    const backtest = _backtests.find((b) => b.run_id === runId);
    return mockResponse(backtest || null);
  },

  getBacktestMetrics: async (_runId: string) => {
    await delay();
    return mockResponse({
      total_return: 4250,
      total_return_pct: 42.5,
      win_rate: 62.5,
      total_trades: 156,
      winning_trades: 98,
      losing_trades: 58,
      sharpe_ratio: 1.85,
      max_drawdown: 1230,
      max_drawdown_pct: 12.3,
      avg_win: 85.5,
      avg_loss: -42.3,
      profit_factor: 2.1,
      final_equity: 14250,
    });
  },

  getBacktestEquity: async (_runId: string) => {
    await delay();
    return mockResponse({ equity: mockEquityHistory });
  },

  getBacktestTrades: async (_runId: string) => {
    await delay();
    return mockResponse({ trades: mockBacktestTrades });
  },

  deleteBacktest: async (runId: string) => {
    await delay();
    _backtests = _backtests.filter((b) => b.run_id !== runId);
    return mockResponse({ success: true });
  },

  // Debate
  listDebates: async () => {
    await delay();
    return mockResponse({ sessions: mockDebateSessions });
  },

  createDebate: async (data: any) => {
    await delay();
    return mockResponse({
      id: `debate-${Date.now()}`,
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    });
  },

  getDebate: async (sessionId: string) => {
    await delay();
    const session = mockDebateSessions.find((s) => s.id === sessionId);
    return mockResponse(session || null);
  },

  startDebate: async (_sessionId: string) => {
    await delay();
    return mockResponse({ success: true });
  },

  stopDebate: async (_sessionId: string) => {
    await delay();
    return mockResponse({ success: true });
  },

  deleteDebate: async (_sessionId: string) => {
    await delay();
    return mockResponse({ success: true });
  },

  // Settings
  getSettings: async () => {
    await delay();
    return mockResponse(mockSettings);
  },

  updateSettings: async (data: any) => {
    await delay();
    Object.assign(mockSettings, data);
    return mockResponse(mockSettings);
  },
};

// Log mock mode status on load
if (isMockMode) {
  console.log(
    "%c🎭 MOCK MODE ENABLED",
    "background: #f59e0b; color: black; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
  );
  console.log(
    "API calls will return mock data. Disable by removing VITE_USE_MOCK=true from .env"
  );
}
