package health

import (
    "encoding/json"
    "net/http"
    "time"
)

type HealthHandler struct {
    healthRepo *HealthRepo
    startTime time.Time
}

func NewHealthHandler(healthRepo *HealthRepo) *HealthHandler {
    return &HealthHandler{
        healthRepo: healthRepo, 
        startTime: time.Now(),
    }
}

func (h *HealthHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    response := map[string]interface{}{
        "status": "healthy",
        "timestamp": time.Now().UTC(),
        "uptime": time.Since(h.startTime).String(),
    }

    if err := h.healthRepo.Ping(); err != nil {
        response["status"] = "unhealthy"
        response["database"] = "disconected"
        response["error"] = err.Error()
    

        w.WriteHeader(http.StatusServiceUnavailable)
    } else {
        response["database"] = "connected"
        w.WriteHeader(http.StatusOK)
    }

    json.NewEncoder(w).Encode(response)
}
