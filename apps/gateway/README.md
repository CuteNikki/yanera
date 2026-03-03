# Yanera Gateway

The Gateway is the "Ingress" of the Yanera ecosystem. It manages high-performance, sharded WebSocket connections to Discord and delegates event processing to a distributed Worker fleet via Redis.

## Purpose

By decoupling the WebSocket connection from command logic, the Gateway provides a resilient foundation:

- **100% Connection Uptime**: The Gateway stays online even while the Worker is being updated.
- **Infinite Scalability**: The Gateway doesn't care how many Workers are listening; it just pushes data.

## Features

- **Auto-Sharding**: Automatically fetches recommended shard counts from Discord and claims available chunks via Redis NX locks.
- **Health Heartbeats**: Reports live metrics (latency, memory, shard status) to Convex for real-time monitoring on the dashboard.
- **Lightweight Tracking**: Maintains a minimal Set of Guild IDs to track active/unavailable counts without the overhead of a full cache
- **Event Queueing**: Pushes raw event data to a Redis List (`discord_events_queue`) for Workers to consume at their own pace.

## Configuration

The Gateway requires the following environment variables in `apps/gateway/.env.local`:

| Variable          | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `DISCORD_TOKEN`   | Your Discord Bot Token.                                                |
| `REDIS_URL`       | The connection string for your Redis instance.                         |
| `CONVEX_URL`      | Your Convex deployment URL for heartbeat reporting.                    |
| `SHARDS_PER_NODE` | Number of shards each process should handle (64).             |
| `HOSTNAME`        | (Optional) The name of the physical host. Defaults to system hostname. |

## Development

### Run Locally

Ensure you are in the project root:

```bash
bun run dev:gateway
```

### Run via Docker

```bash
docker compose up -d --build gateway
```

## Technical Details

- **WebSocket**: `@discordjs/ws` (Standalone WebSocket manager).
- **Database**: Convex for real-time system state and heartbeats.
- **Queue**: Redis List (`LPUSH` / `BRPOP` pattern).
- **Sharding**: Auto-calculated based on Discord's recommendations and claimed via Redis locks.
