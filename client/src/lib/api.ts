import axios from "axios";
import { isMockMode, mockApi } from "./mockApi";

// Use relative path in production (nginx will proxy to server)
// Use localhost in development
export const API_BASE = import.meta.env.PROD
  ? "/api"
  : "http://localhost:8080/api";

// Storage key for access passkey
const ACCESS_KEY_STORAGE = "trader_access_key";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 300000, // 5 minutes
});

// Add access key to all requests if available
api.interceptors.request.use((config) => {
  const accessKey = localStorage.getItem(ACCESS_KEY_STORAGE);
  if (accessKey) {
    config.headers["X-Access-Key"] = accessKey;
  }
  return config;
});

// Auth API
export const verifyPasskey = (passkey: string) =>
  isMockMode
    ? mockApi.verifyPasskey(passkey)
    : axios.post(`${API_BASE}/auth/verify`, { passkey });

export const setAccessKey = (key: string) => {
  localStorage.setItem(ACCESS_KEY_STORAGE, key);
};

export const clearAccessKey = () => {
  localStorage.removeItem(ACCESS_KEY_STORAGE);
};

export const getStoredAccessKey = () => {
  return localStorage.getItem(ACCESS_KEY_STORAGE);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(ACCESS_KEY_STORAGE);
};

// Strategy API
export const getStrategies = () =>
  isMockMode ? mockApi.getStrategies() : api.get("/strategies");
export const getStrategy = (id: string) =>
  isMockMode ? mockApi.getStrategy(id) : api.get(`/strategies/${id}`);
export const createStrategy = (data: any) =>
  isMockMode ? mockApi.createStrategy(data) : api.post("/strategies", data);
export const updateStrategy = (id: string, data: any) =>
  isMockMode
    ? mockApi.updateStrategy(id, data)
    : api.put(`/strategies/${id}`, data);
export const deleteStrategy = (id: string) =>
  isMockMode ? mockApi.deleteStrategy(id) : api.delete(`/strategies/${id}`);
export const activateStrategy = (id: string) =>
  isMockMode
    ? mockApi.activateStrategy(id)
    : api.post(`/strategies/${id}/activate`);
export const getDefaultConfig = () =>
  isMockMode
    ? mockApi.getDefaultConfig()
    : api.get("/strategies/default-config");
export const recommendPairs = (data?: { count: number; turbo?: boolean }) =>
  isMockMode
    ? mockApi.recommendPairs()
    : api.post("/strategies/recommend-pairs", data);

// Trader API
export const getTraders = () =>
  isMockMode ? mockApi.getTraders() : api.get("/traders");
export const getTrader = (id: string) =>
  isMockMode ? mockApi.getTrader(id) : api.get(`/traders/${id}`);
export const createTrader = (data: any) =>
  isMockMode ? mockApi.createTrader(data) : api.post("/traders", data);
export const updateTrader = (id: string, data: any) =>
  isMockMode ? mockApi.updateTrader(id, data) : api.put(`/traders/${id}`, data);
export const deleteTrader = (id: string) =>
  isMockMode ? mockApi.deleteTrader(id) : api.delete(`/traders/${id}`);
export const startTrader = (id: string) =>
  isMockMode ? mockApi.startTrader(id) : api.post(`/traders/${id}/start`);
export const stopTrader = (id: string) =>
  isMockMode ? mockApi.stopTrader(id) : api.post(`/traders/${id}/stop`);

// Data API
export const getStatus = (traderId: string) =>
  isMockMode
    ? mockApi.getStatus(traderId)
    : api.get(`/status?trader_id=${traderId}`);
export const getAccount = (traderId: string) =>
  isMockMode
    ? mockApi.getAccount(traderId)
    : api.get(`/account?trader_id=${traderId}`);
export const getPositions = (traderId: string) =>
  isMockMode
    ? mockApi.getPositions(traderId)
    : api.get(`/positions?trader_id=${traderId}`);
export const getDecisions = (traderId: string) =>
  isMockMode
    ? mockApi.getDecisions(traderId)
    : api.get(`/decisions?trader_id=${traderId}`);
export const getTrades = (traderId: string) =>
  isMockMode
    ? mockApi.getTrades(traderId)
    : api.get(`/trades?trader_id=${traderId}`);
export const getEquityHistory = (traderId: string) =>
  isMockMode
    ? mockApi.getEquityHistory(traderId)
    : api.get(`/equity-history?trader_id=${traderId}`);

// Health
export const getHealth = () =>
  isMockMode ? mockApi.getHealth() : api.get("/health");

// Backtest API
export const listBacktests = () =>
  isMockMode ? mockApi.listBacktests() : api.get("/backtest");
export const startBacktest = (data: any) =>
  isMockMode ? mockApi.startBacktest(data) : api.post("/backtest/start", data);
export const stopBacktest = (runId: string) =>
  isMockMode
    ? mockApi.stopBacktest(runId)
    : api.post(`/backtest/${runId}/stop`);
export const getBacktestStatus = (runId: string) =>
  isMockMode
    ? mockApi.getBacktestStatus(runId)
    : api.get(`/backtest/${runId}/status`);
export const getBacktestMetrics = (runId: string) =>
  isMockMode
    ? mockApi.getBacktestMetrics(runId)
    : api.get(`/backtest/${runId}/metrics`);
export const getBacktestEquity = (runId: string) =>
  isMockMode
    ? mockApi.getBacktestEquity(runId)
    : api.get(`/backtest/${runId}/equity`);
export const getBacktestTrades = (runId: string) =>
  isMockMode
    ? mockApi.getBacktestTrades(runId)
    : api.get(`/backtest/${runId}/trades`);
export const deleteBacktest = (runId: string) =>
  isMockMode ? mockApi.deleteBacktest(runId) : api.delete(`/backtest/${runId}`);

// Debate API
export const listDebates = () =>
  isMockMode ? mockApi.listDebates() : api.get("/debate/sessions");
export const createDebate = (data: any) =>
  isMockMode ? mockApi.createDebate(data) : api.post("/debate/sessions", data);
export const getDebate = (sessionId: string) =>
  isMockMode
    ? mockApi.getDebate(sessionId)
    : api.get(`/debate/sessions/${sessionId}`);
export const startDebate = (sessionId: string) =>
  isMockMode
    ? mockApi.startDebate(sessionId)
    : api.post(`/debate/sessions/${sessionId}/start`);
export const stopDebate = (sessionId: string) =>
  isMockMode
    ? mockApi.stopDebate(sessionId)
    : api.post(`/debate/sessions/${sessionId}/stop`);
export const deleteDebate = (sessionId: string) =>
  isMockMode
    ? mockApi.deleteDebate(sessionId)
    : api.delete(`/debate/sessions/${sessionId}`);

// Settings API
export const getSettings = () =>
  isMockMode ? mockApi.getSettings() : api.get("/settings");
export const updateSettings = (data: any) =>
  isMockMode ? mockApi.updateSettings(data) : api.put("/settings", data);

export default api;
