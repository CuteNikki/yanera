# Yanera Proxy

The **Proxy** is the "Ear" of the Yanera ecosystem. It maintains a persistent, sharded connection to the Discord Gateway and translates incoming WebSocket events into a Redis-backed message queue.

## Purpose

In traditional bots, the WebSocket connection is tied to the command logic. If the bot crashes or restarts, the connection drops. By separating the **Proxy**, we achieve:

- **100% Connection Uptime**: The Proxy stays online even while the Worker is being updated.
- **Infinite Scalability**: The Proxy doesn't care how many Workers are listening; it just pushes data.

## Features

- **Auto-Sharding**: Uses `@discordjs/ws` to automatically calculate and manage shards based on guild count.
- **Stateless Design**: Does not store data. It strictly receives JSON from Discord and `LPUSH`es it to Redis.
- **Health Monitoring**: Logs shard lifecycle events (Ready, Resumed, Disconnected).

## Configuration

The Proxy requires the following environment variables in `apps/proxy/.env.local`:

| Variable        | Description                                    |
| --------------- | ---------------------------------------------- |
| `DISCORD_TOKEN` | Your Discord Bot Token.                        |
| `REDIS_URL`     | The connection string for your Redis instance. |

## Development

### Run Locally

Ensure you are in the project root:

```bash
bun run dev:proxy
```

### Run via Docker

```bash
docker compose up -d --build proxy
```

## Technical Details

- **Library**: `@discordjs/ws` (Standalone WebSocket manager).
- **Protocol**: Receives `GATEWAY_DISPATCH` events and converts them to JSON strings for Redis.
- **Queue Key**: `discord_events_queue` (Redis List).
