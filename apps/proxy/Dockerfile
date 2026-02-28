FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lock ./

COPY apps/worker/package.json ./apps/worker/
COPY apps/proxy/package.json ./apps/proxy/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

RUN bun install --frozen-lockfile

COPY apps/proxy ./apps/proxy
COPY packages/database ./packages/database

WORKDIR /app/apps/proxy
CMD ["bun", "run", "src/index.ts"]