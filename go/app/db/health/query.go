package health

import (
    "context"
    "time"
)

func (r *HealthRepo) Ping() error {
    ctx, cancel := context.WithTimeout(context.Background(), 5 * time.Second)
    defer cancel()

    return r.db.PingContext(ctx)
}
