package config

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    
    _ "github.com/go-sql-driver/mysql"
)

func ConnectDB()(*sql.DB, error) {

    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPass := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")
    
    connStr := fmt.Sprintf(
        "%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True",
        dbUser, dbPass, dbHost, dbPort, dbName,
    )

    db, err := sql.Open("mysql", connStr)
    if err != nil {
	log.Fatalf("Connection error: %v", err)
	return nil, err
    }

    if err := db.Ping(); err != nil {
	log.Fatalf("Database not allowed: %v", err)
	return nil, err
    }

    log.Println("Successfully connected to database")
    return db, nil

}

