package kafka

import (
  "context"
  "encoding/json"
  "log"

  "github.com/segmentio/kafka-go"
)

type DebeziumEvent struct {

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

      var evt DebeziumEvent 
      if err := json.Unmarshal(m.Value, &evt); err != nil {
	log.Println("failed to parse event: ", err)
	continue
      }

      handleEvent(evt)
    }
  }()
}
