# Yanera Database

The **Database** package is the "Memory" of the Yanera ecosystem. Powered by **Convex**, it provides a real-time, reactive data layer with shared TypeScript definitions used across the entire monorepo.

## Purpose

In a microservice architecture, keeping data in sync can be a nightmare. By using **Convex**, Yanera ensures:

- **Reactive Updates**: When the Worker updates value, the Web Dashboard reflects that change instantly without a page refresh.
- **Type Safety**: TypeScript interfaces are automatically generated from your schema, so the Bot and the Web app always agree on the data structure.
- **Atomic Operations**: Mutations are ACID-compliant, preventing data corruption during high-traffic command bursts.

## Key Features

- **Schema-as-Code**: The database structure is defined in pure TypeScript (`convex/schema.ts`).
- **Edge-Ready**: Queries and mutations run on Convex's global edge network for ultra-low latency.
- **Built-in Search**: Full-text search indexes for quickly finding users or server settings.
- **Shared Client**: A pre-configured Convex client exported for use in both Worker and Browser environments.

## Directory Structure

- `convex/`: The core database logic.
- `schema.ts`: Defines tables, indexes, and relationships.
- `_generated/`: Auto-generated types (do not edit manually).
- `src/index.ts`: The main entry point that exports the client and API types to the rest of the monorepo.

## Configuration

The database requires a connection to your Convex project. Ensure your environment variables are set in the root or relevant app `.env.local` files:

| Variable            | Description                  |
| ------------------- | ---------------------------- |
| `CONVEX_DEPLOYMENT` | Your Convex deployment name. |
| `CONVEX_URL`        | Your Convex deployment URL.  |
| `CONVEX_SITE_URL`   | Your Convex site URL.        |

## Development

### Syncing the Schema

When you make changes to the `convex/` folder, run the dev server from the root to sync types:

```bash
bun run dev:convex
```

### Using in Other Apps

To use the database in the Worker or Web app, simply import the shared API:

```typescript
import { api } from '@yanera/database';
import { useQuery } from 'convex/react';

// Just an example, API and query names will depend on your actual schema:
const data = useQuery(api.guild.getSettings, { guildId: '123' });
```
