# E-commerce Microservices Monorepo

A modern microservices architecture built with NestJS, PostgreSQL, Redis, and Kafka in a monorepo structure with production-ready Docker deployment.

## 🏗️ Architecture

```
ecommerce-app/
├── apps/                    # Microservices
│   ├── auth-service/       # Authentication & JWT (Port 3001)
│   └── users-service/      # User management (Port 3002)
├── packages/               # Shared libraries
│   └── shared/            # Common DTOs, types, utils
├── scripts/               # Setup and utility scripts
├── docs/                  # Documentation
├── db/                    # Database initialization
├── gateway/               # Nginx configuration (Port 80/8080)
└── docker-compose.yml     # Production deployment
```

## 🚀 Quick Start (Fresh Clone)

### Prerequisites

- **Node.js 18+** and **pnpm 8+**
- **Docker & Docker Compose**
- **Git**

### 1. Clone and Install

```bash
git clone https://github.com/SHOMANS/ecommerce-ms-app.git
cd ecommerce-ms-app
pnpm install
```

### 2. Environment Setup

Choose your environment and run the setup script:

**For Development:**

```bash
npm run setup:dev
```

**For Production:**

```bash
npm run setup:prod
# ⚠️ Important: Update passwords in .env before deploying!
```

**For Local Testing:**

```bash
npm run setup:local
```

## 🔄 CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline that automatically:
- **Watches for changes** and triggers builds
- **Runs tests** and code quality checks
- **Builds Docker images** and publishes them
- **Deploys to production** automatically
- **Manages releases** with semantic versioning

### 🚀 GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **CI/CD Pipeline** | Push to any branch, PR to main | Test, build, and deploy |
| **File Watcher** | Push to main, file changes | Monitor performance and validate changes |
| **Auto Deploy** | Successful CI/CD completion | Deploy to EC2 production server |
| **Release Management** | Push to main (with changes) | Create releases and publish Docker images |

### 📋 Pipeline Features

- ✅ **Multi-Node Testing** (Node.js 18.x, 20.x)
- ✅ **Docker Build & Test** with service integration testing
- ✅ **Security Scanning** with Trivy vulnerability scanner
- ✅ **Automatic Deployment** to EC2 production server
- ✅ **Performance Monitoring** with response time benchmarks
- ✅ **Semantic Versioning** with automated releases
- ✅ **Dependency Updates** with Dependabot

### 🔧 CI/CD Scripts

```bash
# Local CI testing
npm run ci:test          # Run linting, tests, and build
npm run ci:docker        # Full Docker integration test

# Service testing
npm run test:services    # Test all services and integrations

# Environment validation
npm run env:validate     # Validate environment configuration
```

### ⚙️ Required GitHub Secrets

For CI/CD to work, add these secrets in GitHub Repository Settings:

```
EC2_HOST              # Your EC2 instance IP/hostname
EC2_USER              # SSH username (usually 'ubuntu')
EC2_PRIVATE_KEY       # Contents of your .pem SSH key file
```

See [.github/SECRETS.md](.github/SECRETS.md) for detailed setup instructions.

### 🔄 Automatic Deployment Flow

1. **Push to main branch** → Triggers CI/CD pipeline
2. **Tests pass** → Builds Docker images
3. **Security scan passes** → Deploys to EC2
4. **Health checks pass** → Creates release (if changes detected)
5. **Publishes Docker images** → Sends notifications

### 📊 Release Management

- **Automatic version detection** based on commit messages:
  - `feat:` or `feature:` → Minor version bump
  - `fix:` or `bugfix:` → Patch version bump  
  - `BREAKING:` or `major:` → Major version bump
- **Automated changelog generation**
- **Docker image tagging** with version numbers
- **GitHub releases** with detailed notes

### 🧪 Testing in CI/CD

The pipeline includes comprehensive testing:

```bash
# Code quality
- ESLint code linting
- TypeScript compilation
- Unit tests with coverage

# Integration testing  
- Docker container builds
- Service health checks
- API endpoint testing
- Kafka message communication
- Database connectivity

# Security testing
- Vulnerability scanning
- Dependency security audit
- Container image scanning
```

### 🚨 Pipeline Notifications

- ✅ **Success**: Deployment completed successfully
- ❌ **Failure**: Detailed error logs and troubleshooting
- 📊 **Performance**: Response time monitoring alerts
- 🔒 **Security**: Vulnerability scan results

### 3. Validate Environment

```bash
npm run env:validate
```

### 4. Start the Application

**Development Mode:**

```bash
npm run docker:dev
```

**Production Mode:**

```bash
npm run docker:prod
```

### 5. Verify Everything is Working

```bash
# Health check
curl http://localhost/health
# or for dev: curl http://localhost:8080/health

# Test signup
curl -X POST http://localhost/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com", "password": "test123"}'

# Test signin
curl -X POST http://localhost/auth/signin \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com", "password": "test123"}'
```

## 📋 Environment Management

### Available Scripts

| Script                 | Description                   | Usage                 |
| ---------------------- | ----------------------------- | --------------------- |
| `npm run setup:dev`    | Setup development environment | First time dev setup  |
| `npm run setup:prod`   | Setup production environment  | First time prod setup |
| `npm run setup:local`  | Setup local environment       | Local testing         |
| `npm run env:validate` | Validate environment setup    | Check configuration   |

### Environment Files

| File                      | Purpose                    | Tracked in Git     |
| ------------------------- | -------------------------- | ------------------ |
| `.env.sample`             | Local development template | ✅ Yes             |
| `.env.development.sample` | Development template       | ✅ Yes             |
| `.env.production.sample`  | Production template        | ✅ Yes             |
| `.env`                    | Active environment file    | ❌ No (gitignored) |
| `.env.development`        | Development overrides      | ❌ No (gitignored) |
| `.env.production`         | Production overrides       | ❌ No (gitignored) |

### Manual Environment Setup

If you prefer manual setup:

```bash
# Development
cp .env.development.sample .env.development
cp .env.development.sample .env

# Production
cp .env.production.sample .env.production
cp .env.production.sample .env
# Remember to update all passwords and secrets!
```

## � Available Scripts

### Environment & Setup

```bash
npm run setup:dev          # Setup development environment
npm run setup:prod         # Setup production environment
npm run setup:local        # Setup local environment
npm run env:validate       # Validate environment configuration
```

### Development

```bash
pnpm dev                   # Run all services in development mode
pnpm build                 # Build all packages
pnpm test                  # Run tests across all packages
pnpm lint                  # Lint all packages
pnpm clean                 # Clean all build artifacts
```

### Docker Commands

```bash
# Development
npm run docker:dev         # Start development containers
npm run docker:dev:build   # Build and start development containers
npm run docker:dev:down    # Stop development containers
npm run docker:dev:logs    # View development logs

# Production
npm run docker:prod        # Start production containers
npm run docker:prod:build  # Build and start production containers
npm run docker:prod:down   # Stop production containers
npm run docker:prod:logs   # View production logs
```

### Individual Service Commands

```bash
# Run specific service
pnpm --filter @ecommerce/auth-service start:dev
pnpm --filter @ecommerce/users-service start:dev

# Build specific service
pnpm --filter @ecommerce/auth-service build

# Test specific service
pnpm --filter @ecommerce/auth-service test
```

## � Services

### 🔐 Auth Service (Port 3001)

**Features:**

- User registration & authentication
- JWT token generation & validation
- Password hashing with bcrypt
- Kafka integration for user data requests

**Endpoints:**

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User authentication
- `GET /health` - Health check

### 👤 Users Service (Port 3002)

**Features:**

- User profile management
- User data CRUD operations
- Kafka event handling
- Database persistence

**Endpoints:**

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/all` - List all users
- `GET /users/:id` - Get user by ID
- `GET /health` - Health check

### 🌐 Gateway (Port 80/8080)

**Features:**

- Nginx reverse proxy with load balancing
- 2 replicas per service for high availability
- Health checks and auto-recovery
- Production-ready SSL termination support

## 🏗️ Production Features

### High Availability

- **Service replicas**: 2 instances of each service
- **Load balancing**: Nginx with round-robin
- **Health checks**: 30s intervals with auto-restart
- **Resource limits**: 512M memory, 0.5 CPU per service

### Inter-Service Communication

- **Kafka messaging**: Request-response pattern between services
- **Database isolation**: Separate PostgreSQL databases per service
- **Redis caching**: Shared cache for session management
- **Service discovery**: Docker network with service names

### Security & Configuration

- **Environment isolation**: Separate dev/prod configurations
- **Secret management**: Environment-based JWT secrets and passwords
- **Container security**: Non-root users, minimal images
- **Network isolation**: Internal Docker network communication

## 🗄️ Database Schema

### Auth Service Database (`auth_service`)

```sql
-- Users table with authentication data
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Users Service Database (`users_service`)

```sql
-- Users table with profile data
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## � Kafka Integration

### Message Flow

1. **Auth Service** sends user lookup requests to `user.lookup.request` topic
2. **Users Service** responds via `auth_service_replies` topic
3. **Timeout handling**: 15-second timeout with fallback data
4. **Consumer groups**: `auth-consumer` and `users-consumer`

### Event Types

- `user.lookup.request` - Request user data by email
- `user.lookup.response` - Response with user profile data

## 🔍 Monitoring & Health

### Health Checks

All services include comprehensive health monitoring:

```bash
# Check all services
curl http://localhost/health

# Individual service health
curl http://localhost:3001/health  # Auth service
curl http://localhost:3002/health  # Users service
```

### Docker Health Checks

- **Interval**: 30 seconds
- **Timeout**: 3 seconds
- **Retries**: 3 attempts
- **Start period**: 5 seconds grace period

### Logging

- **Development**: Debug level with detailed Kafka logs
- **Production**: Info level with structured logging
- **Container logs**: `docker-compose logs -f [service]`

## 🧪 Testing the Application

### Manual API Testing

**1. Health Check:**

```bash
curl http://localhost/health
# Expected: "healthy"
```

**2. User Signup:**

```bash
curl -X POST http://localhost/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
# Expected: user object + JWT token
```

**3. User Signin:**

```bash
curl -X POST http://localhost/auth/signin \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
# Expected: user object with profile data + JWT token
```

**4. Test Kafka Communication:**
The signin endpoint tests the full Kafka request-response cycle:

- Auth service requests user data from Users service
- Users service queries database and responds via Kafka
- Auth service receives response and returns complete user data

## 🚀 Deployment

### Local Development

```bash
npm run setup:dev
npm run docker:dev
```

### Production Deployment

```bash
npm run setup:prod
# Update passwords and secrets in .env
npm run env:validate
npm run docker:prod
```

### Cloud Deployment (AWS EC2 Example)

```bash
# On EC2 instance
git clone https://github.com/SHOMANS/ecommerce-ms-app.git
cd ecommerce-ms-app
npm run setup:prod
# Update .env with production values
npm run docker:prod

# Configure security group for ports 80, 443
```

## 🔒 Security Best Practices

### Environment Security

- ✅ **Sample files tracked**: Templates for easy setup
- ✅ **Actual env files ignored**: Secrets protected from Git
- ✅ **Production validation**: Script warns about default secrets
- ✅ **Strong defaults**: Secure password requirements

### Application Security

- ✅ **JWT authentication**: Stateless token validation
- ✅ **Password hashing**: bcrypt with configurable rounds
- ✅ **Input validation**: NestJS DTOs and pipes
- ✅ **CORS protection**: Configurable origins
- ✅ **Container security**: Non-root users, minimal attack surface

### Network Security

- ✅ **Internal networking**: Services communicate via Docker network
- ✅ **Database isolation**: Separate databases per service
- ✅ **Load balancer**: Single entry point through nginx
- ✅ **Health monitoring**: Automatic restart of failed services

## � Documentation

- **Environment Setup**: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)
- **API Documentation**: Available when services are running
- **Docker Reference**: [DOCKER.md](DOCKER.md)

## 🛠️ Development Workflow

### Adding New Features

1. **Update shared packages** in `packages/shared` if needed
2. **Modify service code** in `apps/[service-name]`
3. **Test locally** with `npm run docker:dev`
4. **Validate environment** with `npm run env:validate`
5. **Deploy to production** with `npm run docker:prod`

### Debugging Services

```bash
# View all service logs
npm run docker:dev:logs

# View specific service logs
docker-compose logs -f auth-service
docker-compose logs -f users-service

# Execute commands in running containers
docker-compose exec auth-service sh
docker-compose exec users-service sh
```

## 📋 Troubleshooting

### Common Issues

**Environment not set up:**

```bash
npm run env:validate
# Follow the recommendations
```

**Services failing to start:**

```bash
docker-compose logs [service-name]
# Check for Kafka connection issues, database connectivity
```

**Kafka connection timeouts:**

```bash
# Restart Kafka and dependent services
docker-compose restart kafka auth-service users-service
```

**Port conflicts:**

```bash
# Check if ports are in use
lsof -i :80 -i :3001 -i :3002 -i :5432 -i :6379 -i :9092
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Setup environment**: `npm run setup:dev`
4. **Make your changes** and test locally
5. **Validate setup**: `npm run env:validate`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Submit a pull request**

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

---

## 🆘 Need Help?

- **Environment Issues**: Check [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)
- **Docker Problems**: Run `npm run env:validate`
- **API Testing**: Use the curl examples above
- **Service Communication**: Check Kafka logs with `docker-compose logs kafka`

**Quick diagnosis:** `npm run env:validate && docker-compose ps`
