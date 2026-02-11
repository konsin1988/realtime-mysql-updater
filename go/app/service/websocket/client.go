package websocket

import (
  "context"
  "log"
  "time"

  "nhooyr.io/websocket"
)

type Client struct {
  conn	  *websocket.Conn
  hub	  *Hub
}

func NewClient(conn *websocket.Conn, hub *Hub) *Client {
  return &Client{
    conn: conn,
    hub: hub,
  }
}

func (c *Client) ReadLoop() {
  defer func() {
    c.hub.Unregister(c)
    c.conn.Close(websocket.StatusNormalClosure, "")
  }()

  for {
    _, _, err := c.conn.Read(context.Background())
    if err != nil {
      break
    }
  }
}

func (c *Client) Send (ctx context.Context, msg []byte) {
  ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
  defer cancel()

  err := c.conn.Write(ctx, websocket.MessageText, msg)
  if err != nil {
    log.Println("Write error: ", err)
    c.hub.Unregister(c)
    c.conn.Close(websocket.StatusInternalError, "")
  }
}
