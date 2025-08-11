# Environment Setup Guide

This project uses environment-specific configuration files to manage different deployment scenarios.

## Quick Start

### For Development

```bash
npm run setup:dev
# or
npm run env:dev
```

### For Production

```bash
npm run setup:prod
# or
npm run env:prod
```

### For Local Testing

```bash
npm run setup:local
# or
npm run env:local
```

## Environment Files

### Available Sample Files

- `.env.sample` - Basic local development settings
- `.env.development.sample` - Development environment template
- `.env.production.sample` - Production environment template

### Generated Files (Not tracked in Git)

- `.env` - Main environment file used by Docker Compose
- `.env.development` - Development-specific overrides
- `.env.production` - Production-specific overrides

## Manual Setup

If you prefer manual setup:

1. **Development:**

   ```bash
   cp .env.development.sample .env.development
   cp .env.development.sample .env
   ```

2. **Production:**

   ```bash
   cp .env.production.sample .env.production
   cp .env.production.sample .env
   # IMPORTANT: Update passwords and secrets before deploying!
   ```

3. **Local:**
   ```bash
   cp .env.sample .env
   ```

## Security Notes

⚠️ **IMPORTANT:** For production deployments:

1. Update all passwords in `.env.production`
2. Change JWT secrets to strong, random values
3. Use environment-specific database credentials
4. Never commit actual `.env` files to version control

## Environment Variables Reference

| Variable            | Description        | Dev Default   | Prod Default    |
| ------------------- | ------------------ | ------------- | --------------- |
| `POSTGRES_HOST`     | Database host      | `localhost`   | `postgres`      |
| `POSTGRES_PASSWORD` | Database password  | `root`        | `CHANGE_THIS_*` |
| `JWT_SECRET`        | JWT signing secret | Dev key       | `CHANGE_THIS_*` |
| `NODE_ENV`          | Environment mode   | `development` | `production`    |
| `LOG_LEVEL`         | Logging level      | `debug`       | `info`          |
| `GATEWAY_PORT`      | API Gateway port   | `8080`        | `80`            |

## Scripts Usage

```bash
# Environment setup
npm run setup:dev      # Setup development environment
npm run setup:prod     # Setup production environment
npm run setup:local    # Setup local environment

# Docker commands (after env setup)
npm run docker:dev     # Start development containers
npm run docker:prod    # Start production containers
```
