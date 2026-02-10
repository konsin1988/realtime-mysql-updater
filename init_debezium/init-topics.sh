#!/bin/bash
#
/opt/kafka/bin/kafka-topics.sh --create \
                                --topic debezium \
                                --bootstrap-server kafka:9092 \
                                --partitions 1 \
                                --replication-factor 1 \
                                --config retention.ms=60000


/opt/kafka/bin/kafka-topics.sh --create \
  --topic connect_configs \
  --bootstrap-server kafka:9092 \
  --replication-factor 1 \
  --partitions 1 \
  --config cleanup.policy=compact

Two more topics: connect_offsets,  connect_statuses
