package health 

import (
  "database/sql"
)

type HealthRepo struct {
  db *sql.DB
}

func NewHealthRepo(db *sql.DB) *HealthRepo{
  return &HealthRepo{db: db}
}
