package websocket

import (
  "net/http"

  "nhooyr.io/websocket"
)

func (h *Hub) HandleWS(w http.ResponseWriter, r *http.Request) {
  conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
    InsecureSkipVerify: true,	// dev
  })
  if err != nil {
    return
  }

  client := NewClient(conn, h)
  h.Register(client)

  go client.ReadLoop()
}
