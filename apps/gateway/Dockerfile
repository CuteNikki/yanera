FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lock ./

COPY apps/worker/package.json ./apps/worker/
COPY apps/gateway/package.json ./apps/gateway/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

RUN bun install --frozen-lockfile

COPY apps/gateway ./apps/gateway
COPY packages/database ./packages/database

WORKDIR /app/apps/gateway
CMD ["bun", "run", "src/index.ts"]