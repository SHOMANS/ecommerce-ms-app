# 🐳 Docker Multi-Stage Build Guide

This project supports both **development** and **production** environments with optimized Docker configurations.

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for Docker

## 🛠️ Development Environment

### Features:

- ✅ Hot reload with volume mounts
- ✅ Source code mounted for instant changes
- ✅ All dev dependencies included
- ✅ Debug-friendly configuration
- ✅ Exposed ports for direct access

### Commands:

```bash
# Start development environment
pnpm docker:dev

# Start with rebuild
pnpm docker:dev:build

# View logs
pnpm docker:dev:logs

# Stop development environment
pnpm docker:dev:down
```

### Development URLs:

- **Auth Service**: http://localhost:3001
- **Users Service**: http://localhost:3002
- **API Gateway**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Kafka**: localhost:9092

## 🚀 Production Environment

### Features:

- ✅ Multi-stage optimized builds
- ✅ Minimal production images
- ✅ Non-root user security
- ✅ Health checks included
- ✅ Resource limits configured
- ✅ Multiple replicas support
- ✅ Production nginx configuration

### Commands:

```bash
# Start production environment
pnpm docker:prod

# Start with rebuild
pnpm docker:prod:build

# View logs
pnpm docker:prod:logs

# Stop production environment
pnpm docker:prod:down
```

### Production URLs:

- **API Gateway**: http://localhost (port 80)
- **HTTPS Gateway**: https://localhost (port 443) - when SSL configured

## 🔐 Environment Configuration

### Development (.env.development):

```bash
NODE_ENV=development
JWT_SECRET=development_secret_key
POSTGRES_PASSWORD=root
REDIS_HOST=localhost
```

### Production (.env.production):

```bash
NODE_ENV=production
JWT_SECRET=super_secure_jwt_secret_key_change_this
POSTGRES_PASSWORD=secure_production_password
REDIS_PASSWORD=secure_redis_password
```

**⚠️ IMPORTANT**: Change all passwords and secrets in production!

## 📊 Build Stages Explained

### Base Stage:

- Sets up Node.js 18 Alpine
- Installs pnpm
- Copies workspace configuration

### Development Stage:

- Installs ALL dependencies (including dev)
- Mounts source code for hot reload
- Exposes debug ports
- Starts with `pnpm start:dev`

### Builder Stage:

- Installs all dependencies
- Builds shared package
- Builds service applications
- Creates optimized bundles

### Production Stage:

- Minimal Alpine image
- Only production dependencies
- Non-root user (`nestjs`)
- Health checks configured
- Optimized for size and security

## 🔧 Build Process

### Manual Build Commands:

```bash
# Build development images
docker-compose -f docker-compose.dev.yml build

# Build production images
docker-compose build

# Build specific service for development
docker build --target development -t auth-service:dev -f apps/auth-service/Dockerfile .

# Build specific service for production
docker build --target production -t auth-service:prod -f apps/auth-service/Dockerfile .
```

## 📈 Performance Optimizations

### Development:

- Volume mounts for instant code changes
- No build step required for changes
- Full debugging capabilities

### Production:

- Multi-stage builds reduce image size by ~60%
- Only production dependencies
- Gzip compression enabled
- Resource limits prevent resource exhaustion
- Health checks ensure service reliability

## 🔍 Monitoring & Health Checks

### Built-in Health Endpoints:

- **Auth Service**: `/health`
- **Users Service**: `/health`
- **Gateway**: `/health`

### Docker Health Checks:

```bash
# Check service health
docker-compose ps

# View health check logs
docker inspect <container_name> --format='{{.State.Health}}'
```

## 🛡️ Security Features

### Production Security:

- Non-root user execution
- Minimal attack surface
- Security headers in nginx
- Rate limiting configured
- Environment variable secrets

### Network Security:

- Isolated Docker networks
- Internal service communication
- External access only through gateway

## 📝 Troubleshooting

### Common Issues:

#### Build Failures:

```bash
# Clean build with no cache
docker-compose build --no-cache

# Check build logs
docker-compose logs <service_name>
```

#### Permission Issues:

```bash
# Fix volume permissions (development)
sudo chown -R $USER:$USER .
```

#### Port Conflicts:

```bash
# Check port usage
netstat -tulpn | grep :3001

# Change ports in compose files if needed
```

#### Memory Issues:

```bash
# Increase Docker memory limit
# Docker Desktop -> Settings -> Resources -> Memory

# Or use resource limits in compose
```

## 📋 Production Deployment Checklist

- [ ] Change all default passwords
- [ ] Update JWT secrets
- [ ] Configure SSL certificates
- [ ] Set up monitoring
- [ ] Configure log aggregation
- [ ] Set up backup strategies
- [ ] Configure firewalls
- [ ] Update resource limits based on load
- [ ] Set up CI/CD pipeline
- [ ] Configure secrets management

## 🚨 Emergency Commands

```bash
# Stop everything immediately
docker-compose down
docker-compose -f docker-compose.dev.yml down

# Remove all containers and volumes
docker-compose down -v --remove-orphans

# Clean up Docker system
docker system prune -af
```

---

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Build Documentation](https://docs.docker.com/develop/develop-images/multistage-build/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
