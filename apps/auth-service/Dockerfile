# Multi-stage Dockerfile for Auth Service
FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/auth-service ./apps/auth-service

# Development stage
FROM base AS development

# Install all dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Build shared package
RUN pnpm --filter @ecommerce/shared build

# Build auth-service
RUN pnpm --filter @ecommerce/auth-service build

# Expose port and start in development mode
EXPOSE 3001
CMD ["sh", "-c", "node $(find dist -name 'main.js' | head -1)"]

# Builder stage for production
FROM base AS builder

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build shared package first
RUN pnpm --filter @ecommerce/shared build

# Build auth-service
RUN pnpm --filter @ecommerce/auth-service build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/auth-service/package.json ./apps/auth-service/

# Install all dependencies (including runtime dependencies like @nestjs/*)
RUN pnpm install --frozen-lockfile

# Copy built applications
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

WORKDIR /app/apps/auth-service

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

CMD ["sh", "-c", "node $(find dist -name 'main.js' | head -1)"]