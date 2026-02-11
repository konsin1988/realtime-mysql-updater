package realtime

import (
  "context"
  "encoding/json"
  "log"

  kafka "konsin1988/debezium/service/kafka"
  ws "konsin1988/debezium/service/websocket"
)

type Service struct {
  hub *ws.Hub
}

func NewService(hub *ws.Hub) *Service{
  return &Service{hub: hub}
}

func (s *Service) HandleDataFormCarEvent(evt kafka.DebeziumEvent) {
  switch evt.Op {
  case "c", "r", "u":
    if evt.After != nil {
      log.Printf("Updated row: %+v\n", *evt.After)
      data, _ := json.Marshal(evt.After)
      s.hub.Broadcast(context.Background(), data)
    }

  case "d":
    if evt.Before != nil {
      log.Printf("Deleted row: %+v\n", *evt.Before)
      data, _ := json.Marshal(evt.Before)
      s.hub.Broadcast(context.Background(), data)
    }
  }
}
