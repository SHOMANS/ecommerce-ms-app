FROM node:18-alpine AS builder

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages

# Copy users-service
COPY apps/users-service ./apps/users-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile

# Build shared package first
RUN pnpm --filter @ecommerce/shared build

# Build users-service
RUN pnpm --filter @ecommerce/users-service build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/users-service/package.json ./apps/users-service/

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/users-service/dist ./apps/users-service/dist

WORKDIR /app/apps/users-service

CMD ["node", "dist/main"]