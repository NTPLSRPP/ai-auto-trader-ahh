# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-09

### Added
- **Live Strategy Reload**: Strategy configuration changes now apply immediately to running traders without requiring a restart. When you save a strategy in the UI, all running engines using that strategy are automatically updated.
- **Risk Settings Logging**: Added detailed logging that shows which risk management features are active (Trailing Stop, Max Hold Duration, Smart Loss Cut, Emergency Shutdown) once per minute per trader. This helps verify your settings are working correctly.
- **Copy Trading Support**: Added "Binance Copy Trading" mode to strategies. In this mode, the bot acts as a monitor for a copy trading portfolio (reading status, balance, positions) without executing independent AI trades. (#25e8b00)
- **Trader Configuration**:
  - Implemented per-trader OpenRouter API key and customized model selection, allowing different bots to use different AI accounts/models. (#2ba362b)
  - Added drag-and-drop reordering for traders in the Configuration page. (#a7fe563, #d9f5349)
- **Strategy Management**:
  - Added Import/Export functionality for strategy settings (JSON format). (#1bdf89c)
  - Added "Smart Find" feature to automatically recommend trading pairs using AI. (#f1103f9, #0f14525)
  - Added "Turbo Mode" toggle for aggressive, high-volatility scalping. (#5fea4a6, #86af0e7)
  - Added "Simple Mode" toggle to mimic v1.4.7 behavior (minimal interference, trusting SL/TP). (#7214dda, #d3ac05c)
- **Risk Management**:
  - Implemented **Multi-Timeframe Confirmation** (MTF): Trades now require confirmation from a higher timeframe (e.g., 5m + 15m). (#ea19592)
  - Added **Emergency Shutdown System** that halts trading if equity drops below a configurable safety limit. (#a6fde77, #185bc17)
  - Added Daily Loss Limit and Max Drawdown configuration with optional "Close All Positions" trigger. (#d9ebae0, #6e583dc)
  - Added Trailing Stop and Max Hold Duration features. (#6e0a1c7)
- **Dashboard**:
  - Enhanced AI Decisions display with signal summaries. (#c707a24)
  - Added visual indicators for active/inactive bots.
- **Market Data**:
  - Implemented Dynamic Coin Sourcing (e.g., "Top 20 by Volume") with caching. (#dfdc86d)
  - Added BTC Global Market Context inclusion for better AI decision making. (#d30b523)

### Changed
- **AI Logic**:
  - Raised default minimum AI confidence threshold to **85%**. (#ea19592)
  - Refined AI system prompts to strictly enforce 3:1 Risk/Reward ratios. (#fbac434)
  - Improved Smart Loss Management to prevent premature exits during market noise. (#38fc064, #eaad3b4)
- **Architecture**:
  - Refactored `StrategyConfig` to support new Trading Mode and indicator settings. (#25e8b00, #ea19592)
  - Optimized build process and reduced minimum position sizes for testing. (#a7fe563)
- **UI/UX**:
  - Hidden irrelevant strategy settings (Risk Control, AI Prompt) when "Binance Copy Trading" mode is active.

### Fixed
- **Simple Mode now works with Trailing Stop**: Redesigned Simple Mode to only disable automatic drawdown protection. Trailing Stop, Max Hold Duration, and Smart Loss Cut now work correctly when enabled, even if Simple Mode is ON.
- **Strategy Config Not Applying**: Fixed critical bug where strategy configuration changes made in the UI were not applied to running traders until they were stopped and restarted. Strategy changes now apply immediately.
- Fixed critical issue where orphaned SL/TP orders caused "Order Immediate or Cancel" errors. (#78db4b5)
- Fixed filtering of inactive/delisted symbols from Binance API. (#bf4baef)
- Fixed various UI labeling issues in the Strategy Editor.

### Removed
- Removed legacy `logs.txt` and temporary CSV export files. (#4051bd7, #8956d63)

## [v3.22.0] - 2026-01-07

### Added
- **Dashboard Enhancements**: 
  - Added signal summary indicators (e.g., "2 BUY, 1 SELL") to the AI Decisions card header. (#c707a24)
  - Implemented detailed "Spotlight Cards" for decision logs with color-coded confidence scores and reasoning snippets. (#c707a24)

## [v3.21.0] - 2026-01-07

### Added
- **Loss Limits UI**: Added input fields for "Max Daily Loss %" and "Max Drawdown %" in Strategy Configuration. (#d9ebae0)
- **Documentation**: Added recommended settings documentation suggesting a 15% daily loss limit for high leverage trading. (#0d582dc)

## [v3.20.0] - 2026-01-06

### Added
- **Emergency Shutdown**: 
  - Added UI toggle and threshold input for the "Emergency Shutdown" system. (#185bc17)
  - Implemented backend logic to actively monitor account equity at the start of each cycle and halt trading if it falls below the safety floor (default $60). (#a6fde77)

## [v3.19.0] - 2026-01-06

### Changed
- **Smart Loss V2**: Upgraded the smart loss logic to be more tolerant of volatility when using high leverage (20x+), preventing "shake-out" exits on noise. (#eaad3b4)

## [v3.18.0] - 2026-01-06

### Added
- **Three-Zone Management**: Implemented "Profit", "Noise", and "Danger" zones in both the engine logic and AI prompts to nuanced position management. (#38fc064)

### Fixed
- **Leverage Calculation**: Fixed a bug where leverage multipliers were not correctly applying to position size calculations in some edge cases. (#c415855)

## [v3.17.0] - 2026-01-06

### Added
- **Anti-Hedging Logic**: Added safety checks to prevent opening a position if an opposite position already exists (e.g., won't open LONG if SHORT exists) to avoid "Hedge Mode" API errors. (#9b58c26)

## [v3.15.0] - 2026-01-06

### Added
- **Turbo Mode**: 
  - Added "Turbo Mode" toggle to Strategy settings for high-frequency scalping. (#5fea4a6)
  - Updated "Smart Find" to recommend volatile pairs suitable for Turbo strategies. (#0f14525)
- **UI**: Added badges to the static coin input field for better visibility. (#0f14525)

## [v3.13.0] - 2026-01-06

### Added
- **Global Context**: Added logic to fetch 24h ticker stats for `BTCUSDT` and inject it into the AI prompt for every trade, providing global market sentiment context. (#d30b523)

### Fixed
- **Validation**: Fixed bug where positions were sometimes closed prematurely due to incorrect profit threshold calculations in negative PnL scenarios. (#ff0adf0)

## [v3.10.0] - 2026-01-06

### Added
- **Auto-Reversal**: Implemented logic to automatically close an existing position if the AI signals a reversal (e.g., Close SHORT and Open LONG). (#125252e)

## [v3.9.0] - 2026-01-06

### Added
- **Dynamic Sourcing**: Added "Top by Volume" option to Coin Source configuration, allowing the bot to automatically trade the top 20 volume coins on Binance. (#dfdc86d)

## [v3.7.0] - 2026-01-05

### Added
- **Live Logs**: Implemented Server-Sent Events (SSE) to stream server logs directly to the frontend UI in real-time. (#64e84ca)

### Fixed
- **Networking**: Configured custom HTTP transport for OpenRouter client to force IPv4 usage, resolving persistent "Context Deadline Exceeded" timeout errors. (#dafd99b)

## [v3.5.0] - 2026-01-05

### Added
- **Bubble Chart**: Integrated d3-force to create an interactive, physics-based bubble chart on the Rankings page to visualize symbol performance. (#aeef6c3)

## [v3.0.0] - 2026-01-05

### Added
- **Global Settings**: Added a new "Configuration" section to the UI for managing global API keys (OpenRouter, Binance), simplifying setup for multi-bot environments. (#faa9c78)

## [v2.0.0] - 2026-01-05

### Changed
- **Mobile UI**: Major overhaul of the mobile interface, introducing a bottom navigation dock and converting data tables to card views for better mobile usability. (#baf98a6)

## [v1.6.0] - 2026-01-04

### Added
- **PnL Tracking**: Implemented polling of Binance Trade History to accurately track and display "Realized PnL" separate from Unrealized PnL. (#44ce590)

## [v1.4.10] - 2026-01-03

### Fixed
- **Order Types**: Switched to using Binance `STOP_MARKET` and `TAKE_PROFIT_MARKET` Algo Orders for SL/TP to resolve "Order Type Not Supported" errors in One-Way Mode. (#720688d)

## [v1.4.7] - 2026-01-01

### Added
- **Initial Release**: Baseline version with core AI decision loop and basic execution logic.
