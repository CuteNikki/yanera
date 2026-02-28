##### WORK IN PROGRESS - This project is under active development.

Expect breaking changes and incomplete documentation. Please open an issue or reach out if you want to contribute or have questions.

Things are still in very early stages, but the overall architecture and design are mostly settled. The Proxy and Worker are both functional.

# Yanera

Yanera is a high-performance, microservice-based Discord ecosystem. By decoupling the Gateway connection from the processing logic, it achieves near-infinite scalability and 100% uptime during deployments.

Built with Bun, Docker, Convex, and Redis.

## Architecture

Unlike traditional monolithic bots, Yanera splits the workload into specialized services:

- [**Proxy**](apps/proxy/README.md): The "Ear" - Maintains the WebSocket connection to Discord. It is purely stateless, pushing raw events into a Redis queue.
- [**Worker**](apps/worker/README.md): The "Brain" - A scalable consumer that pulls jobs from Redis, interacts with the database, and responds via REST.
- [**Web**](apps/web/README.md): The "Face" - A Next.js dashboard for real-time server management and analytics.
- [**Database**](packages/database/README.md): The "Memory" - Shared types and Convex schema for reactive, real-time data synchronization.

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

   Launch the entire development stack (Proxy, Worker, Convex, and Dashboard) in a single terminal:

   ```bash
   bun run dev
   ```

### Tooling and Scripts

- `bun run dev`: Spins up the entire local workspace via Concurrently.
- `bun run dev:worker`: Runs the Worker with file watching.
- `bun run dev:proxy`: Runs the Proxy server.
- `bun run dev:web`: Runs the Next.js dashboard.
- `bun run dev:convex`: Starts the Convex dev server for real-time schema syncing.
- `docker compose up -d --build`: Rebuilds and deploys the backend microservices.
- `docker compose down`: Tears down the Docker environment.
- `docker compose logs -f`: Streams logs from all services for debugging.

## Directory Structure

```
yanera/
├── apps/
│   ├── proxy/          # Discord proxy
│   ├── worker/         # Processing worker
│   └── web/            # Next.js Website/Dashboard
├── packages/
│   └── database/       # Convex Schema & Shared TypeScript definitions
├── docker-compose.yml  # Backend Orchestration
└── README.md           # You are here!
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
