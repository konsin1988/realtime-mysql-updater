#!/bin/bash
#
/opt/kafka/bin/kafka-topics.sh --create \
                                --topic debezium \
                                --bootstrap-server kafka:9092 \
                                --partitions 1 \
                                --replication-factor 1 \
                                --config retention.ms=60000
