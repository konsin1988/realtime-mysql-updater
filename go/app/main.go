package main

import (
    "log"
    "net/http"
    "path/filepath"

    "konsin1988/debezium/config"
    health "konsin1988/debezium/db/health"
    kafka "konsin1988/debezium/service/kafka"
    realtime "konsin1988/debezium/service/realtime"
    ws "konsin1988/debezium/service/websocket"
)

func main(){
    db, err := config.ConnectDB()
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    hub := ws.NewHub()
    realtimeService := realtime.NewService(hub)

    kafka.StartKafkaReader([]string{"kafka:9092"}, 
			"db.new_rtpc.DataFormCar",
			"rtpc-realtime-api",
			realtimeService.HandleDataFormCarEvent,
      )

    healthRepo := health.NewHealthRepo(db)
    healthHandler := health.NewHealthHandler(healthRepo)

    mux := http.NewServeMux()
    mux.HandleFunc("/debezium/api/health", healthHandler.HealthCheck)

    // WebSocket
    mux.HandleFunc("/debezium/ws", hub.HandleWS)

    // API
    //r.Route("/debezium/api", func(r chi.Router) {
    //    r.Get("/{db}/{entity}/{format}/", exportHandler.Export)
    //})


    // Static assets
    fs := http.FileServer(http.Dir("ui"))
    mux.Handle("/debezium/assets/", http.StripPrefix("/debezium", fs))

    
    // SPA fallback
    mux.HandleFunc("/debezium", func(w http.ResponseWriter, r *http.Request) {
        http.Redirect(w, r, "/debezium/", http.StatusMovedPermanently)
    })

    mux.HandleFunc("/debezium/", func(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, filepath.Join("ui", "index.html"))
    })


    log.Println("Server started on :8000")
    log.Fatal(http.ListenAndServe(":8000", mux))
}
