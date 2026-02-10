package main

import (
    "log"
    "net/http"
    "strings"
    "path/filepath"

    "konsin1988/debezium/config"
    health "konsin1988/debezium/db/health"
    kafka "konsin1988/debezium/service/kafka"
)

func FileServer(mux *http.ServeMux, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit URL parameters")
	}

	fs := http.StripPrefix(path, http.FileServer(root))

	if path != "/" && !strings.HasSuffix(path, "/") {
		mux.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
			http.Redirect(w, r, path+"/", http.StatusMovedPermanently)
		})
		path += "/"
	}
	mux.Handle(path, fs)
}

func main(){
    db, err := config.ConnectDB()
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    kafka.StartKafkaReader([]string{"kafka:9092"}, 
			"db.dbserver1.new_rtpc.DataFormCar",
			"rtpc-realtime-api",
			func(evt kafka.DebeziumEvent) {
			  log.Println("received event:", evt)
			}

    healthRepo := health.NewHealthRepo(db)
    healthHandler := health.NewHealthHandler(healthRepo)

    mux := http.NewServeMux()
    mux.HandleFunc("/debezium/api/health", healthHandler.HealthCheck)

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
