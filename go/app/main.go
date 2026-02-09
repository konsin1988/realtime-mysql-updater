package main

import (
    "log"
    "net/http"

    "konsin1988/debezium/config"
    health "konsin1988/debezium/db/health"
)

func main(){
    db, err := config.ConnectDB()
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    healthRepo := health.NewHealthRepo(db)
    healthHandler := health.NewHealthHandler(healthRepo)

    mux := http.NewServeMux()
    mux.HandleFunc("/health", healthHandler.HealthCheck)

    log.Println("Server started on :8000")
    log.Fatal(http.ListenAndServe(":8000", mux))
}
