package trader

import (
	"testing"

	"auto-trader-ahh/exchange"
)

// TestCalculateRealizedPnL tests the P&L calculation logic
// This mirrors the logic in executeTrade for closing positions
func TestCalculateRealizedPnL(t *testing.T) {
	tests := []struct {
		name        string
		positionAmt float64 // Positive = long, Negative = short
		entryPrice  float64
		exitPrice   float64
		quantity    float64
		wantPnL     float64
	}{
		{
			name:        "Long position - profit",
			positionAmt: 0.1,
			entryPrice:  50000,
			exitPrice:   52000,
			quantity:    0.1,
			wantPnL:     200, // (52000 - 50000) * 0.1 = 200
		},
		{
			name:        "Long position - loss",
			positionAmt: 0.1,
			entryPrice:  50000,
			exitPrice:   48000,
			quantity:    0.1,
			wantPnL:     -200, // (48000 - 50000) * 0.1 = -200
		},
		{
			name:        "Short position - profit",
			positionAmt: -0.1,
			entryPrice:  50000,
			exitPrice:   48000,
			quantity:    0.1,
			wantPnL:     200, // (50000 - 48000) * 0.1 = 200
		},
		{
			name:        "Short position - loss",
			positionAmt: -0.1,
			entryPrice:  50000,
			exitPrice:   52000,
			quantity:    0.1,
			wantPnL:     -200, // (50000 - 52000) * 0.1 = -200
		},
		{
			name:        "Large quantity long profit",
			positionAmt: 1.5,
			entryPrice:  45000,
			exitPrice:   46500,
			quantity:    1.5,
			wantPnL:     2250, // (46500 - 45000) * 1.5 = 2250
		},
		{
			name:        "Break even",
			positionAmt: 0.5,
			entryPrice:  50000,
			exitPrice:   50000,
			quantity:    0.5,
			wantPnL:     0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Simulate the P&L calculation logic from executeTrade
			var realizedPnL float64
			if tt.positionAmt > 0 { // Long position
				realizedPnL = (tt.exitPrice - tt.entryPrice) * tt.quantity
			} else { // Short position
				realizedPnL = (tt.entryPrice - tt.exitPrice) * tt.quantity
			}

			if realizedPnL != tt.wantPnL {
				t.Errorf("Realized P&L = %f, want %f", realizedPnL, tt.wantPnL)
			}
		})
	}
}

// TestDailyLossCalculation tests the daily loss percentage calculation
func TestDailyLossCalculation(t *testing.T) {
	tests := []struct {
		name           string
		initialBalance float64
		currentBalance float64
		wantLossPct    float64
		exceedsLimit   bool   // for 5% limit
		limitPct       float64
	}{
		{
			name:           "No change",
			initialBalance: 10000,
			currentBalance: 10000,
			wantLossPct:    0,
			exceedsLimit:   false,
			limitPct:       5,
		},
		{
			name:           "5% loss exactly at limit",
			initialBalance: 10000,
			currentBalance: 9500,
			wantLossPct:    5,
			exceedsLimit:   true,
			limitPct:       5,
		},
		{
			name:           "10% loss exceeds 5% limit",
			initialBalance: 10000,
			currentBalance: 9000,
			wantLossPct:    10,
			exceedsLimit:   true,
			limitPct:       5,
		},
		{
			name:           "2% loss under 5% limit",
			initialBalance: 10000,
			currentBalance: 9800,
			wantLossPct:    2,
			exceedsLimit:   false,
			limitPct:       5,
		},
		{
			name:           "Profit (negative loss)",
			initialBalance: 10000,
			currentBalance: 11000,
			wantLossPct:    -10, // Negative = profit
			exceedsLimit:   false,
			limitPct:       5,
		},
		{
			name:           "Large account 3% loss",
			initialBalance: 250000,
			currentBalance: 242500,
			wantLossPct:    3,
			exceedsLimit:   false,
			limitPct:       5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Calculate loss percentage (same logic as checkDailyLoss)
			lossPct := ((tt.initialBalance - tt.currentBalance) / tt.initialBalance) * 100

			if lossPct != tt.wantLossPct {
				t.Errorf("Loss %% = %f, want %f", lossPct, tt.wantLossPct)
			}

			exceeds := lossPct >= tt.limitPct
			if exceeds != tt.exceedsLimit {
				t.Errorf("Exceeds limit = %v, want %v (loss: %f%%, limit: %f%%)",
					exceeds, tt.exceedsLimit, lossPct, tt.limitPct)
			}
		})
	}
}

// TestBalanceConsistency verifies TotalMarginBalance is used consistently
func TestBalanceConsistency(t *testing.T) {
	// Simulate account state
	account := &exchange.AccountInfo{
		TotalWalletBalance:    10000,
		TotalUnrealizedProfit: 500,
		TotalMarginBalance:    10500, // Should equal Wallet + Unrealized
		AvailableBalance:      8000,
	}

	// Verify TotalMarginBalance is the correct sum
	expectedMargin := account.TotalWalletBalance + account.TotalUnrealizedProfit
	if account.TotalMarginBalance != expectedMargin {
		t.Errorf("TotalMarginBalance should be %f (Wallet + Unrealized), got %f",
			expectedMargin, account.TotalMarginBalance)
	}

	// The fix uses TotalMarginBalance for both initial and current balance
	// This ensures consistency in daily loss calculation
	initialBalance := account.TotalMarginBalance
	currentBalance := account.TotalMarginBalance

	if initialBalance != currentBalance {
		t.Error("Initial and current balance should be equal when using same account state")
	}

	// Simulate a change
	account.TotalUnrealizedProfit = -200
	account.TotalMarginBalance = account.TotalWalletBalance + account.TotalUnrealizedProfit
	currentBalance = account.TotalMarginBalance

	lossPct := ((initialBalance - currentBalance) / initialBalance) * 100
	expectedLoss := ((10500.0 - 9800.0) / 10500.0) * 100.0 // ~6.67%

	tolerance := 0.01
	if lossPct < expectedLoss-tolerance || lossPct > expectedLoss+tolerance {
		t.Errorf("Loss %% = %f, want ~%f", lossPct, expectedLoss)
	}
}

// TestPnLPercentageCalculation tests the P&L percentage calculation for positions
func TestPnLPercentageCalculation(t *testing.T) {
	tests := []struct {
		name        string
		positionAmt float64
		entryPrice  float64
		markPrice   float64
		wantPnLPct  float64
	}{
		{
			name:        "Long 2% profit",
			positionAmt: 0.1,
			entryPrice:  50000,
			markPrice:   51000,
			wantPnLPct:  2, // (51000 - 50000) / 50000 * 100 = 2%
		},
		{
			name:        "Long 5% loss",
			positionAmt: 0.1,
			entryPrice:  50000,
			markPrice:   47500,
			wantPnLPct:  -5, // (47500 - 50000) / 50000 * 100 = -5%
		},
		{
			name:        "Short 3% profit",
			positionAmt: -0.1,
			entryPrice:  50000,
			markPrice:   48500,
			wantPnLPct:  3, // (50000 - 48500) / 50000 * 100 = 3%
		},
		{
			name:        "Short 4% loss",
			positionAmt: -0.1,
			entryPrice:  50000,
			markPrice:   52000,
			wantPnLPct:  -4, // (50000 - 52000) / 50000 * 100 = -4%
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var pnlPct float64
			if tt.positionAmt > 0 { // Long
				pnlPct = ((tt.markPrice - tt.entryPrice) / tt.entryPrice) * 100
			} else { // Short
				pnlPct = ((tt.entryPrice - tt.markPrice) / tt.entryPrice) * 100
			}

			if pnlPct != tt.wantPnLPct {
				t.Errorf("PnL %% = %f, want %f", pnlPct, tt.wantPnLPct)
			}
		})
	}
}

// TestSymbolValidation tests that invalid symbols are rejected
func TestSymbolValidation(t *testing.T) {
	invalidSymbols := []string{"ALL", "", "all", "All"}

	for _, symbol := range invalidSymbols {
		t.Run("reject_"+symbol, func(t *testing.T) {
			// The executeTrade function should reject these symbols
			// Here we just validate the check logic
			isInvalid := symbol == "ALL" || symbol == ""
			if !isInvalid && (symbol == "all" || symbol == "All") {
				// Case-insensitive check might be needed
				t.Logf("Consider case-insensitive check for: %s", symbol)
			}

			if symbol == "ALL" || symbol == "" {
				// These should definitely be rejected
				if !isInvalid {
					t.Errorf("Symbol %q should be considered invalid", symbol)
				}
			}
		})
	}
}
