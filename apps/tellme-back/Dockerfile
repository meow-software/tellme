# Step 1: build with turborepo
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for prisma(remove after test prisma)
# RUN apk add --no-cache openssl make g++ python3

# Copy root files
COPY package.json package-lock.json turbo.json ./

# Copy source code
COPY prune/tellme-back/full/apps/tellme-back ./apps/tellme-back
COPY prune/tellme-back/full/packages ./packages

RUN npm ci

# Generate Prisma client for ws-db package (decomment for test prisma)
# WORKDIR /app/packages/ws-db
# RUN npx prisma generate
# Back to root for turbo build
# WORKDIR /app

# Build only the desired service
RUN npx turbo run build --filter=tellme-back...

# Step 2: runner
FROM node:20-slim AS runner

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy your service
COPY --from=builder /app/apps/tellme-back/dist ./dist
COPY --from=builder /app/apps/tellme-back/package.json ./

# Also copy built shared packages
COPY --from=builder /app/packages ./packages

CMD ["node", "dist/main.js"]
