package api

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"auto-trader-ahh/store"
	"auto-trader-ahh/trader"
)

type Server struct {
	port           string
	strategyStore  *store.StrategyStore
	traderStore    *store.TraderStore
	decisionStore  *store.DecisionStore
	equityStore    *store.EquityStore
	engineManager  *trader.EngineManager
}

func NewServer(port string, em *trader.EngineManager) *Server {
	return &Server{
		port:          port,
		strategyStore: store.NewStrategyStore(),
		traderStore:   store.NewTraderStore(),
		decisionStore: store.NewDecisionStore(),
		equityStore:   store.NewEquityStore(),
		engineManager: em,
	}
}

func (s *Server) Start() error {
	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/api/health", s.handleHealth)

	// Strategy endpoints
	mux.HandleFunc("/api/strategies", s.handleStrategies)
	mux.HandleFunc("/api/strategies/", s.handleStrategy)
	mux.HandleFunc("/api/strategies/active", s.handleActiveStrategy)
	mux.HandleFunc("/api/strategies/default-config", s.handleDefaultConfig)

	// Trader endpoints
	mux.HandleFunc("/api/traders", s.handleTraders)
	mux.HandleFunc("/api/traders/", s.handleTrader)

	// Data endpoints
	mux.HandleFunc("/api/status", s.handleStatus)
	mux.HandleFunc("/api/account", s.handleAccount)
	mux.HandleFunc("/api/positions", s.handlePositions)
	mux.HandleFunc("/api/decisions", s.handleDecisions)
	mux.HandleFunc("/api/equity-history", s.handleEquityHistory)

	// Wrap with CORS middleware
	handler := corsMiddleware(mux)

	log.Printf("API server starting at http://localhost:%s", s.port)
	return http.ListenAndServe(":"+s.port, handler)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (s *Server) jsonResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (s *Server) errorResponse(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// Health check
func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	s.jsonResponse(w, map[string]interface{}{
		"status": "ok",
		"time":   time.Now().Format(time.RFC3339),
	})
}

// ============ STRATEGY ENDPOINTS ============

func (s *Server) handleStrategies(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		strategies, err := s.strategyStore.List()
		if err != nil {
			s.errorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}
		s.jsonResponse(w, map[string]interface{}{"strategies": strategies})

	case "POST":
		var strategy store.Strategy
		if err := json.NewDecoder(r.Body).Decode(&strategy); err != nil {
			s.errorResponse(w, http.StatusBadRequest, "Invalid request body")
			return
		}
		if err := s.strategyStore.Create(&strategy); err != nil {
			s.errorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}
		s.jsonResponse(w, strategy)

	default:
		s.errorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func (s *Server) handleStrategy(w http.ResponseWriter, r *http.Request) {
	// Extract ID from path: /api/strategies/{id}
	id := r.URL.Path[len("/api/strategies/"):]
	if id == "" {
		s.errorResponse(w, http.StatusBadRequest, "Strategy ID required")
		return
	}

	// Handle activate endpoint
	if len(id) > 9 && id[len(id)-9:] == "/activate" {
		if r.Method == "POST" {
			stratID := id[:len(id)-9]
			if err := s.strategyStore.SetActive(stratID); err != nil {
				s.errorResponse(w, http.StatusInternalServerError, err.Error())
				return
			}
			s.jsonResponse(w, map[string]string{"status": "activated"})
		}
		return
	}

	switch r.Method {
	case "GET":
		strategy, err := s.strategyStore.Get(id)
		if err != nil {
			s.errorResponse(w, http.StatusNotFound, "Strategy not found")
			return
		}
		s.jsonResponse(w, strategy)

	case "PUT":
		var strategy store.Strategy
		if err := json.NewDecoder(r.Body).Decode(&strategy); err != nil {
			s.errorResponse(w, http.StatusBadRequest, "Invalid request body")
			return
		}
		strategy.ID = id
		if err := s.strategyStore.Update(&strategy); err != nil {
			s.errorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}
		s.jsonResponse(w, strategy)

	case "DELETE":
		if err := s.strategyStore.Delete(id); err != nil {
			s.errorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}
		s.jsonResponse(w, map[string]string{"status": "deleted"})

	default:
		s.errorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func (s *Server) handleActiveStrategy(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		s.errorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	strategy, err := s.strategyStore.GetActive()
	if err != nil {
		s.errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	s.jsonResponse(w, strategy)
}

func (s *Server) handleDefaultConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		s.errorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	s.jsonResponse(w, store.DefaultStrategyConfig())
}

// ============ TRADER ENDPOINTS ============

func (s *Server) handleTraders(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		traders, err := s.traderStore.List()
		if err != nil {
			s.errorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}

		// Enhance with runtime status
		result := make([]map[string]interface{}, len(traders))
		for i, t := range traders {
			result[i] = map[string]interface{}{
				"id":              t.ID,
				"name":            t.Name,
				"strategy_id":     t.StrategyID,
				"exchange":        t.Exchange,
				"status":          t.Status,
				"initial_balance": t.InitialBalance,
				"created_at":      t.CreatedAt,
				"is_running":      s.engineManager.IsRunning(t.ID),
			}
		}
		s.jsonResponse(w, map[string]interface{}{"traders": result})

	case "POST":
		var trader store.Trader
		if err := json.NewDecoder(r.Body).Decode(&trader); err != nil {
			s.errorResponse(w, http.StatusBadRequest, "Invalid request body")
			return
		}
		if err := s.traderStore.Create(&trader); err != nil {
			s.errorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}
		s.jsonResponse(w, trader)

	default:
		s.errorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func (s *Server) handleTrader(w http.ResponseWriter, r *http.Request) {
	// Extract path parts: /api/traders/{id} or /api/traders/{id}/action
	path := r.URL.Path[len("/api/traders/"):]
	parts := splitPath(path)

	if len(parts) == 0 {
		s.errorResponse(w, http.StatusBadRequest, "Trader ID required")
		return
	}

	id := parts[0]
	action := ""
	if len(parts) > 1 {
		action = parts[1]
	}

	// Handle actions
	if action != "" && r.Method == "POST" {
		switch action {
		case "start":
			if err := s.engineManager.Start(id); err != nil {
				s.errorResponse(w, http.StatusInternalServerError, err.Error())
				return
			}
			s.traderStore.UpdateStatus(id, "running")
			s.jsonResponse(w, map[string]string{"status": "started"})

		case "stop":
			s.engineManager.Stop(id)
			s.traderStore.UpdateStatus(id, "stopped")
			s.jsonResponse(w, map[string]string{"status": "stopped"})

		default:
			s.errorResponse(w, http.StatusBadRequest, "Unknown action")
		}
		return
	}

	// Standard CRUD
	switch r.Method {
	case "GET":
		trader, err := s.traderStore.Get(id)
		if err != nil {
			s.errorResponse(w, http.StatusNotFound, "Trader not found")
			return
		}
		s.jsonResponse(w, trader)

	case "PUT":
		var trader store.Trader
		if err := json.NewDecoder(r.Body).Decode(&trader); err != nil {
			s.errorResponse(w, http.StatusBadRequest, "Invalid request body")
			return
		}
		trader.ID = id
		if err := s.traderStore.Update(&trader); err != nil {
			s.errorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}
		s.jsonResponse(w, trader)

	case "DELETE":
		s.engineManager.Stop(id) // Stop if running
		if err := s.traderStore.Delete(id); err != nil {
			s.errorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}
		s.jsonResponse(w, map[string]string{"status": "deleted"})

	default:
		s.errorResponse(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// ============ DATA ENDPOINTS ============

func (s *Server) handleStatus(w http.ResponseWriter, r *http.Request) {
	traderID := r.URL.Query().Get("trader_id")
	if traderID == "" {
		s.errorResponse(w, http.StatusBadRequest, "trader_id required")
		return
	}

	status := s.engineManager.GetStatus(traderID)
	s.jsonResponse(w, status)
}

func (s *Server) handleAccount(w http.ResponseWriter, r *http.Request) {
	traderID := r.URL.Query().Get("trader_id")
	if traderID == "" {
		s.errorResponse(w, http.StatusBadRequest, "trader_id required")
		return
	}

	account := s.engineManager.GetAccount(traderID)
	s.jsonResponse(w, account)
}

func (s *Server) handlePositions(w http.ResponseWriter, r *http.Request) {
	traderID := r.URL.Query().Get("trader_id")
	if traderID == "" {
		s.errorResponse(w, http.StatusBadRequest, "trader_id required")
		return
	}

	positions := s.engineManager.GetPositions(traderID)
	s.jsonResponse(w, map[string]interface{}{"positions": positions})
}

func (s *Server) handleDecisions(w http.ResponseWriter, r *http.Request) {
	traderID := r.URL.Query().Get("trader_id")
	if traderID == "" {
		s.errorResponse(w, http.StatusBadRequest, "trader_id required")
		return
	}

	decisions, err := s.decisionStore.ListByTrader(traderID, 50)
	if err != nil {
		s.errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	s.jsonResponse(w, map[string]interface{}{"decisions": decisions})
}

func (s *Server) handleEquityHistory(w http.ResponseWriter, r *http.Request) {
	traderID := r.URL.Query().Get("trader_id")
	if traderID == "" {
		s.errorResponse(w, http.StatusBadRequest, "trader_id required")
		return
	}

	snapshots, err := s.equityStore.ListByTrader(traderID, 1000)
	if err != nil {
		s.errorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	s.jsonResponse(w, map[string]interface{}{"history": snapshots})
}

func splitPath(path string) []string {
	var parts []string
	current := ""
	for _, c := range path {
		if c == '/' {
			if current != "" {
				parts = append(parts, current)
				current = ""
			}
		} else {
			current += string(c)
		}
	}
	if current != "" {
		parts = append(parts, current)
	}
	return parts
}
