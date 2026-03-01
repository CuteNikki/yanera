##### WORK IN PROGRESS - This project is under active development.

Expect breaking changes and incomplete documentation. Please open an issue or reach out if you want to contribute or have questions.

Things are still in very early stages, but the overall architecture and design are mostly settled. The Gateway and Worker are both functional.

# Yanera

Yanera is a high-performance, microservice-based Discord ecosystem. By decoupling the Gateway connection from the processing logic, it achieves near-infinite scalability and 100% uptime during deployments.

Built with Bun, Docker, Convex, and Redis.

## Architecture

Unlike traditional monolithic bots, Yanera splits the workload into specialized services:

- [**Gateway**](apps/gateway/README.md): The "Ear" - Maintains persistent, sharded WebSocket connections to Discord. It negotiates shard ownership via Redis and pushes raw events into a shared queue.
- [**Worker**](apps/worker/README.md): The "Brain" - A scalable consumer fleet that pulls jobs from Redis, interacts with the database, and responds via REST.
- [**Web**](apps/web/README.md): The "Face" - A Next.js dashboard for real-time infrastructure monitoring, server management, and analytics.
- [**Database**](packages/database/README.md): The "Memory" — Reactive, real-time data synchronization using Convex.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh)
- [Docker](https://www.docker.com/)

### Development Flow

1. Bootstrap the Monorepo

   Clone the repository and install dependencies:

   ```bash
   bun install
   ```

2. Boot the Infrastructure

   Start Redis and any other persistent services:

   ```bash
   docker compose up -d redis
   ```

3. Ignition

   Launch the entire development stack (Gateway, Worker, Convex, and Dashboard) in a single terminal:

   ```bash
   bun run dev
   ```

### Tooling and Scripts

- `bun run dev`: Spins up the entire local workspace via Concurrently.
- `bun run dev:worker`: Runs the Worker with file watching.
- `bun run dev:gateway`: Runs the Gateway node.
- `bun run dev:web`: Runs the Next.js dashboard.
- `bun run dev:convex`: Starts the Convex dev server for real-time schema syncing.
- `docker ps`: Lists running containers and their status.
- `docker compose logs -f`: Streams logs from all services for debugging.
- `docker compose down`: Tears down the Docker environment.
- `docker compose up -d --build`: Rebuilds and deploys the backend microservices.
- `docker compose up -d --scale worker=3`: Scales the Worker service to 3 instances.
- `docker compose up -d redis`: Starts only the Redis service.

## Directory Structure

```
yanera/
├── apps/
│   ├── gateway/        # Discord shard gateway & coordinator
│   ├── worker/         # Event processing worker
│   └── web/            # Next.js Website/Dashboard
├── packages/
│   └── database/       # Convex Schema & Shared types
├── docker-compose.yml  # Infrastructure Orchestration
└── README.md           # You are here!
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
