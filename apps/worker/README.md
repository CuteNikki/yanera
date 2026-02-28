# Yanera Worker

The **Worker** is the "brain" / core processing engine of the Yanera ecosystem. It is a stateless, horizontally scalable consumer that pulls Discord events from a Redis queue and executes the corresponding application logic.

## Purpose

By separating the logic from the WebSocket connection (Proxy), the Worker provides:

- **Horizontal Scaling**: Need to handle more commands? Just spin up more Worker containers. Redis will load-balance the events between them automatically.
- **Fault Tolerance**: If a Worker crashes while processing a command, the Proxy stays connected to Discord.
- **Database-First Logic**: Built to work seamlessly with **Convex**, ensuring all server settings and user data are reactive and real-time.

## Features

- **Queue-Based**: Uses `blPop` (Blocking Left Pop) on Redis to efficiently wait for new events without spiking CPU.
- **Dynamic Loading**: Automatically scans the directories. Adding a new feature is as simple as dropping in a new `.ts` file.
- **Stateless REST Execution**: Responds to Discord interactions via standard HTTPS requests (no persistent connection required).
- **Type-Safe**: Fully integrated with the `@yanera/database` shared package for end-to-end TypeScript safety.

## Configuration

Requires these variables in `apps/worker/.env`:

| Variable            | Description                                 |
| ------------------- | ------------------------------------------- |
| `DISCORD_TOKEN`     | Required for sending REST responses.        |
| `DISCORD_CLIENT_ID` | Your Bot's Application ID.                  |
| `REDIS_URL`         | Redis connection string.                    |
| `CONVEX_URL`        | Your deployment URL for the Convex backend. |

## Development

### Run Locally

```bash
bun run dev:worker
```

### Scale via Docker

```bash
# Run 3 workers simultaneously
docker compose up -d --scale worker=3
```
