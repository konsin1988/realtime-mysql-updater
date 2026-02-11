package websocket

import (
  "context"
  "sync"
)

type Hub struct {
  clients   map[*Client]bool
  mu	    sync.RWMutex
}

func NewHub() *Hub {
  return &Hub{
    clients: make(map[*Client]bool),
  }
}

func (h *Hub) Register (c *Client){
  h.mu.Lock()
  defer h.mu.Unlock()
  h.clients[c] = true
}

func (h *Hub) Unregister(c *Client){
  h.mu.Lock()
  defer h.mu.Unlock()
  delete(h.clients, c)
}

func (h *Hub) Broadcast(ctx context.Context, msg []byte) {
  h.mu.RLock()
  defer h.mu.RUnlock()

  for client := range h.clients {
    client.Send(ctx, msg)
  }
}
