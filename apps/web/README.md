# Yanera Web (Dashboard)

The **Web** application is the "Face" of the Yanera ecosystem. Built with **Next.js 15**, **Tailwind CSS**, and **Shadcn/UI**, it provides a seamless, real-time management interface for server administrators and users.

## Purpose

The dashboard bridges the gap between the Discord interface and the underlying data. It allows users to:

- **Configure Settings**: Change bot behavior without using complex chat commands.
- **View Real-time Stats**: See metrics update live via Convex subscriptions.
- **Secure Authentication**: Log in safely using Discord OAuth2.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/).
- **Database Client**: [Convex](https://convex.dev/) (Reactive React hooks).
- **Authentication**: IDK YET? (Discord Provider).

## Key Features

- **Discord Login**: Secure OAuth2 flow to identify users and their managed guilds.
- **SSR & Streaming**: High-performance page loads with React Server Components.
- **Responsive Design**: Fully optimized for mobile and desktop management.
- **Server Selection**: Intelligent filtering to show only servers where the bot is present.

## Configuration

The Web app requires these variables in `apps/web/.env.local`:

| Variable                 | Description                 |
| ------------------------ | --------------------------- |
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL. |
| AUTH VARIABLES?          | For Discord OAuth2?         |

## Development

### Run Locally

Ensure the Convex dev server is running first, then start the Next.js app from the root:

```bash
bun run dev:web
```

### Production Build

```bash
bun run build:web
```
