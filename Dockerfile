# Use Bun's official image
FROM oven/bun:1 AS base
# Dummy build arg to set database URL at build time
ENV DATABASE_URL="postgres://user:password@localhost:5432/dbname"

WORKDIR /app

# Install OpenSSL so Prisma can detect libssl/openssl
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies with bun and generate Prisma client
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock* ./
# Copy prisma schema so `prisma generate` can find it
COPY prisma ./prisma

RUN bun install --no-save --frozen-lockfile

# Generate Prisma Client
RUN bunx prisma generate

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["bun", "./server.js"]