# Real-Time Database Change Propagation System

## Overview

This project introduces a non-intrusive solution for detecting database changes in a legacy platform and propagating them to a modern client application in real time.

The legacy system (React + NodeJS + MySQL) cannot be significantly modified due to limited team capacity and maintenance constraints. Therefore, this solution observes database-level changes and distributes them through an event-driven architecture.

The system ensures that:

- Database changes are detected automatically
- Backend services are notified without modifying the legacy app
- Clients receive updates in real time
- Business logic can verify whether required changes occurred before proceeding


## Problem Statement

The legacy platform:

- Client: **React**
- Server: **NodeJS**
- Database: **MySQL**

Constraints:

- No team capacity to refactor legacy code
- No safe way to deeply integrate new logic into NodeJS backend
- New features require validation that certain database changes occurred

We needed a decoupled and reliable mechanism to:

1. Detect changes in MySQL
2. Deliver those changes to a new service
3. Push updates to a SPA client in real time
4. Allow business workflows to wait for or validate DB mutations


## High-Level Architecture

```
MySQL
   │
   ▼
Debezium (CDC)
   │
   ▼
Apache Kafka
   │
   ▼
Go Server (Consumer + Business Logic)
   │
   ▼
WebSocket
   │
   ▼
SolidJS Client (SPA)
```


## Technology Stack

### Database Layer

- **MySQL** — primary relational database
- **Debezium** — Change Data Capture (CDC)
- **Apache Kafka** — event streaming platform

### Backend

- **Go** — Kafka consumer + WebSocket server
- Kafka consumer group for processing DB change events
- Event filtering and business validation logic

### Frontend

- **SolidJS** (SPA)
- WebSocket client connection
- Real-time UI updates based on backend events

## How It Works

### 1. Change Data Capture (CDC)

Debezium monitors MySQL binlogs and captures:

- INSERT
- UPDATE
- DELETE

Each change is converted into a structured event and published to a Kafka topic.


### 2. Event Streaming (Kafka)

Kafka acts as a durable event bus:

- Stores database change events
- Allows scalable consumption
- Guarantees ordering per partition
- Supports replaying events if needed


### 3. Go Backend Processing

The Go service:

- Subscribes to relevant Kafka topics
- Parses Debezium event payloads
- Filters events by:

  - Table
  - Operation type
  - Business conditions
- Maintains internal state if required
- Sends relevant updates to connected clients via WebSocket

Additionally, it can:

- Block or delay certain operations until a required DB change is observed
- Validate that expected mutations occurred


### 4. Real-Time Client Updates

The SolidJS SPA:

- Establishes a WebSocket connection to the Go server
- Subscribes to relevant channels/events
- Reacts to incoming updates
- Updates UI state in real time

This removes the need for polling.

## Why This Architecture?

### 1. Zero Changes to Legacy Backend

We do not modify the existing NodeJS server.

### 2. Event-Driven Design

Database changes become first-class events.

### 3. Loose Coupling

Each layer is independent:

- Database
- Event streaming
- Processing service
- Client

### 4. Scalability

Kafka + consumer groups allow horizontal scaling.

### 5. Reliability

Kafka guarantees durable storage of events.

## Example Flow

Example: A user updates a record in the legacy system.

1. Legacy NodeJS server updates MySQL.
2. MySQL writes change to binlog.
3. Debezium captures change.
4. Event published to Kafka topic.
5. Go server consumes event.
6. Business logic validates the change.
7. WebSocket sends update to client.
8. SolidJS updates UI in real time.


## Event Structure (Debezium)

Typical message contains:

- `before` (previous state)
- `after` (new state)
- `op` (operation type: c/u/d)
- `ts_ms` (timestamp)
- metadata (source, table, etc.)

The Go service extracts only relevant fields for business processing.


## WebSocket Contract

Example message format sent to client:

```json
{
  "type": "ENTITY_UPDATED",
  "entity": "order",
  "id": "12345",
  "payload": {
    "status": "COMPLETED"
  }
}
```

The client must:

- Handle reconnection
- Handle idempotent updates
- Ignore irrelevant events


## Deployment Considerations

### Kafka

- Ensure proper topic partitioning
- Configure retention policies
- Monitor consumer lag

### Debezium

- Validate binlog configuration
- Monitor connector health
- Handle schema evolution carefully

### Go Service

- Implement graceful shutdown
- Use context cancellation
- Handle backpressure

### WebSockets

- Implement heartbeat/ping
- Handle client reconnections
- Consider horizontal scaling with shared state (e.g., Redis if needed)


## Observability

Recommended:

- Kafka lag monitoring
- Debezium connector metrics
- Structured logging in Go
- WebSocket connection metrics
- Alerting on consumer failures


## Known Limitations

- Eventual consistency (not strictly synchronous)
- Requires proper ordering guarantees per entity
- Schema changes require coordination
- Complex transactions may produce multiple events


## Future Improvements

- Add schema registry
- Introduce message versioning
- Add retry & dead-letter queue
- Implement authentication for WebSocket
- Add event filtering per user/session


## Summary

This solution enables real-time detection and propagation of database changes without modifying a legacy system.

By leveraging:

- MySQL binlog
- Debezium (CDC)
- Apache Kafka
- Go backend service
- WebSocket
- SolidJS SPA

we achieve a scalable, decoupled, and maintainable architecture suitable for incremental modernization.
