# dockerfile
FROM oven/bun:1 AS base
ENV DATABASE_URL="postgres://user:password@localhost:5432/dbname"
ENV COOKIE_SECRET="abcd1234efgh5678ijkl9012mnop3456"

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_IMAGE_OPTIMIZER_URL
ARG NEXT_PUBLIC_PADDLE_CLIENT_TOKEN

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_IMAGE_OPTIMIZER_URL=$NEXT_PUBLIC_IMAGE_OPTIMIZER_URL
ENV NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=$NEXT_PUBLIC_PADDLE_CLIENT_TOKEN

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app

# copy package files and install dependencies only
COPY package.json bun.lock* ./

RUN bun install --no-save --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bunx prisma generate

RUN bun run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["bun", "./server.js"]
