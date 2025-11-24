# dockerfile
FROM oven/bun:1 AS base
ENV DATABASE_URL="postgres://user:password@localhost:5432/dbname"
WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app

# copy package + prisma schema and the pre-generated client under src/generated
COPY package.json bun.lock* ./
COPY prisma ./prisma
COPY src/generated ./src/generated

RUN bun install --no-save --frozen-lockfile

# run prisma generate (may be a no-op if generator already produced output),
# then ensure /app/generated exists and is populated from any possible output location
RUN bunx prisma generate || true && \
    mkdir -p /app/generated && \
    if [ -d generated ]; then cp -r generated/* /app/generated/; fi && \
    if [ -d src/generated ]; then cp -r src/generated/* /app/generated/; fi && \
    if [ -d node_modules/.prisma/client ]; then mkdir -p /app/generated/prisma && cp -r node_modules/.prisma/client/* /app/generated/prisma/; fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/generated ./generated
COPY . .

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
COPY --from=builder /app/generated ./generated

USER nextjs
EXPOSE 3000
CMD ["bun", "./server.js"]
