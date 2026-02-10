curl -X POST http://localhost:8083/connectors \
     -H "Content-Type: application/json" \
     -d '{
	  "name": "rtpc-connector",
	    "config": {
              "connector.class": "io.debezium.connector.mysql.MySqlConnector",
              "database.hostname": "mysql",
              "database.port": "3306",
              "database.user": "debezium",
              "database.password": "debezium",
              "database.server.id": "184054",
              "database.server.name": "dbserver1",
              "database.include.list": "new_rtpc",
              "table.include.list": "new_rtpc.DataFormCar",
              "include.schema.changes": "false",
              "topic.prefix": "db",
              "snapshot.mode": "initial",
	      "schema.history.internal.kafka.topic": "dbserver1.schema-changes",
	      "schema.history.internal.kafka.bootstrap.servers": "kafka:9092",
	      "database.history.producer.retries": 5
            }
         }'

