package kafka

import (
  "context"
  "encoding/json"
  "log"

  "github.com/segmentio/kafka-go"
  
  car "konsin1988/debezium/db/car"
)

type DebeziumMessage struct {
  Payload   DebeziumEvent   `json:"payload"`
}

type DebeziumEvent struct {
  Before    *car.DataFormCar    `json:"before"`
  After	    *car.DataFormCar    `json:"after"`
  Op	    string	    `json:"op"`
  TsMs	    int64	    `json:"ts_ms"`
}

func StartKafkaReader(brokers []string, topic, groupID string, handleEvent func(DebeziumEvent)){
  r :=	kafka.NewReader(kafka.ReaderConfig{
    Brokers: brokers,
    Topic: topic,
    GroupID: groupID,
  })

  go func() {
    for {
      m, err := r.ReadMessage(context.Background())
      if err != nil {
	log.Fatal(err)
      }

      var msg DebeziumMessage
      if err := json.Unmarshal(m.Value, &msg); err != nil {
        log.Println("failed to parse event: ", err)
        continue
      }

      handleEvent(msg.Payload)
    }
  }()
}
