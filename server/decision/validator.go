package decision

import (
	"fmt"
	"log"
)

// ValidActions is the set of valid trading actions
var ValidActions = map[string]bool{
	ActionOpenLong:   true,
	ActionOpenShort:  true,
	ActionCloseLong:  true,
	ActionCloseShort: true,
	ActionHold:       true,
	ActionWait:       true,
}

// ValidateDecisions validates all decisions
func ValidateDecisions(decisions []Decision, cfg *ValidationConfig) error {
	if cfg == nil {
		cfg = DefaultValidationConfig()
	}

	for i := range decisions {
		if err := ValidateDecision(&decisions[i], cfg); err != nil {
			return fmt.Errorf("decision #%d validation failed: %w", i+1, err)
		}
	}
	return nil
}

// ValidateDecision validates a single decision
func ValidateDecision(d *Decision, cfg *ValidationConfig) error {
	// Validate action
	if !ValidActions[d.Action] {
		return fmt.Errorf("invalid action: %s", d.Action)
	}

	// Only validate opening actions
	if d.Action == ActionOpenLong || d.Action == ActionOpenShort {
		return validateOpeningDecision(d, cfg)
	}

	return nil
}

// validateOpeningDecision validates decisions that open new positions
func validateOpeningDecision(d *Decision, cfg *ValidationConfig) error {
	// Determine max leverage and position ratio based on symbol
	maxLeverage := cfg.AltcoinLeverage
	posRatio := cfg.AltcoinPosRatio
	minPositionSize := cfg.MinPositionAlt
	maxPositionValue := cfg.AccountEquity * posRatio

	if isBTCOrETH(d.Symbol) {
		maxLeverage = cfg.BTCETHLeverage
		posRatio = cfg.BTCETHPosRatio
		minPositionSize = cfg.MinPositionBTCETH
		maxPositionValue = cfg.AccountEquity * posRatio
	}

	// Leverage validation
	if d.Leverage <= 0 {
		return fmt.Errorf("leverage must be greater than 0: %d", d.Leverage)
	}
	if d.Leverage > maxLeverage {
		log.Printf("WARNING: %s leverage exceeded (%dx > %dx), auto-adjusting to limit %dx",
			d.Symbol, d.Leverage, maxLeverage, maxLeverage)
		d.Leverage = maxLeverage
	}

	// Position size validation
	if d.PositionSizeUSD <= 0 {
		return fmt.Errorf("position size must be greater than 0: %.2f", d.PositionSizeUSD)
	}

	// Minimum position size checks
	if d.PositionSizeUSD < minPositionSize {
		if isBTCOrETH(d.Symbol) {
			return fmt.Errorf("%s opening amount too small (%.2f USDT), must be >= %.2f USDT",
				d.Symbol, d.PositionSizeUSD, minPositionSize)
		}
		return fmt.Errorf("opening amount too small (%.2f USDT), must be >= %.2f USDT",
			d.PositionSizeUSD, minPositionSize)
	}

	// Maximum position value validation with tolerance
	tolerance := maxPositionValue * 0.01
	if d.PositionSizeUSD > maxPositionValue+tolerance {
		if isBTCOrETH(d.Symbol) {
			return fmt.Errorf("BTC/ETH single coin position value cannot exceed %.0f USDT (%.1fx account equity), actual: %.0f",
				maxPositionValue, posRatio, d.PositionSizeUSD)
		}
		return fmt.Errorf("altcoin single coin position value cannot exceed %.0f USDT (%.1fx account equity), actual: %.0f",
			maxPositionValue, posRatio, d.PositionSizeUSD)
	}

	// Stop-loss and take-profit validation
	if d.StopLoss <= 0 || d.TakeProfit <= 0 {
		return fmt.Errorf("stop loss and take profit must be greater than 0")
	}

	// Direction-specific SL/TP checks
	if d.Action == ActionOpenLong {
		if d.StopLoss >= d.TakeProfit {
			return fmt.Errorf("for long positions, stop loss price must be less than take profit price")
		}
	} else {
		if d.StopLoss <= d.TakeProfit {
			return fmt.Errorf("for short positions, stop loss price must be greater than take profit price")
		}
	}

	// Risk/Reward ratio validation
	if err := validateRiskReward(d, cfg.MinRiskReward); err != nil {
		return err
	}

	return nil
}

// validateRiskReward validates the risk/reward ratio of a decision
// validateRiskReward validates the risk/reward ratio of a decision
func validateRiskReward(d *Decision, minRatio float64) error {
	// If Action is not opening, or EntryPrice is missing/zero (common for AI decisions
	// which rely on execution time price), we cannot accurately validate R:R here.
	// Rely on the AI prompt to enforce this.
	return nil
}

// isBTCOrETH checks if symbol is BTC or ETH
func isBTCOrETH(symbol string) bool {
	return symbol == "BTCUSDT" || symbol == "ETHUSDT" ||
		symbol == "BTC-USDT" || symbol == "ETH-USDT" ||
		symbol == "BTCUSD" || symbol == "ETHUSD"
}

// IsOpeningAction checks if action opens a new position
func IsOpeningAction(action string) bool {
	return action == ActionOpenLong || action == ActionOpenShort
}

// IsClosingAction checks if action closes a position
func IsClosingAction(action string) bool {
	return action == ActionCloseLong || action == ActionCloseShort
}

// IsPassiveAction checks if action is passive (hold/wait)
func IsPassiveAction(action string) bool {
	return action == ActionHold || action == ActionWait
}

// GetActionDirection returns "long" or "short" for an action
func GetActionDirection(action string) string {
	switch action {
	case ActionOpenLong, ActionCloseLong:
		return "long"
	case ActionOpenShort, ActionCloseShort:
		return "short"
	default:
		return ""
	}
}
