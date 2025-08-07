FROM node:18-alpine AS builder

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages

# Copy auth-service
COPY apps/auth-service ./apps/auth-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile

# Build shared package first
RUN pnpm --filter @ecommerce/shared build

# Build auth-service
RUN pnpm --filter @ecommerce/auth-service build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/auth-service/package.json ./apps/auth-service/

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist

WORKDIR /app/apps/auth-service

CMD ["node", "dist/main"]