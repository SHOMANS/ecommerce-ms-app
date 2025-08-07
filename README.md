# E-commerce Microservices Monorepo

A modern microservices architecture built with NestJS, PostgreSQL, Redis, and Kafka in a monorepo structure.

## 🏗️ Architecture

```
ecommerce-app/
├── apps/                    # Microservices
│   ├── auth-service/       # Authentication & JWT
│   └── users-service/      # User management
├── packages/               # Shared libraries
│   └── shared/            # Common DTOs, types, utils
├── db/                    # Database initialization
├── gateway/               # Nginx configuration
└── tools/                 # Development tools
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### Development Setup

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd ecommerce-app
pnpm install
```

2. **Start infrastructure (PostgreSQL, Redis, Kafka):**

```bash
pnpm docker:up
```

3. **Start all services in development mode:**

```bash
pnpm dev
```

4. **Or start individual services:**

```bash
# Auth service only
pnpm --filter @ecommerce/auth-service start:dev

# Users service only
pnpm --filter @ecommerce/users-service start:dev
```

### Production with Docker

```bash
# Start everything
docker-compose up -d

# View logs
pnpm docker:logs

# Stop everything
pnpm docker:down
```

## 📚 Services

### 🔐 Auth Service (Port 3001)

- User registration & authentication
- JWT token generation & validation
- Password hashing with bcrypt
- Redis session caching

**Endpoints:**

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### 👤 Users Service (Port 3002)

- User profile management
- User data CRUD operations
- Kafka event publishing
- JWT validation

**Endpoints:**

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users` - List users (admin)
- `DELETE /users/:id` - Delete user (admin)

### 🌐 Gateway (Port 8080)

- Nginx reverse proxy
- Load balancing
- Request routing
- Rate limiting

## 🛠️ Available Scripts

### Root Level Commands

```bash
# Build all packages
pnpm build

# Run all services in development
pnpm dev

# Start all services in production mode
pnpm start

# Run tests across all packages
pnpm test

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean

# Docker commands
pnpm docker:up    # Start infrastructure
pnpm docker:down  # Stop everything
pnpm docker:logs  # View logs
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

## 🔧 Configuration

### Environment Files

- `.env.development` - Global development settings
- `apps/auth-service/.env.development` - Auth service config
- `apps/users-service/.env` - Users service config

### Key Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=service_user
DB_PASSWORD=password
DB_NAME=service_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h

# Kafka
KAFKA_BROKERS=localhost:9092

# Redis (auth-service only)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🗄️ Database

### PostgreSQL Setup

The database is automatically initialized with:

- Separate databases for each service
- User accounts with appropriate permissions
- Initial schema setup

### Database per Service

- `auth_service` - Authentication data
- `users_service` - User profiles and metadata

## 📡 Message Queue

### Kafka Events

- `user.created` - New user registration
- `user.updated` - User profile updates
- `user.login` - User login events
- `user.deleted` - User deletion

## 🔍 Monitoring & Health Checks

All services include:

- Health check endpoints
- Structured logging
- Error handling
- Request validation

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run e2e tests
pnpm test:e2e

# Watch mode
pnpm test:watch
```

## 📝 API Documentation

When services are running, API documentation is available at:

- Auth Service: http://localhost:3001/api/docs
- Users Service: http://localhost:3002/api/docs
- Gateway: http://localhost:8080

## 🤝 Development Workflow

1. Make changes to shared packages in `packages/shared`
2. The workspace automatically links shared packages to services
3. Services hot-reload when shared code changes
4. Use `pnpm build` to build all packages
5. Use `pnpm dev` for development with hot reload

## 📦 Package Structure

### Shared Package (`@ecommerce/shared`)

- **DTOs**: Data transfer objects for API validation
- **Types**: TypeScript interfaces and types
- **Utils**: Common utility functions
- **Constants**: Application constants and enums

## 🚀 Deployment

### Docker Production

```bash
# Build and start all services
docker-compose up -d --build

# Scale specific service
docker-compose up -d --scale auth-service=3
```

### Environment-specific Configs

- Development: `.env.development`
- Production: `.env.production`
- Testing: `.env.test`

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable configuration
- CORS protection
- Request validation
- Rate limiting via nginx

## 📋 Todo

- [ ] Add API documentation with Swagger
- [ ] Implement service discovery
- [ ] Add monitoring with Prometheus
- [ ] Set up CI/CD pipeline
- [ ] Add integration tests
- [ ] Implement caching strategies
- [ ] Add logging aggregation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

=========================================================
=========================================================

# Install workspace dependencies
pnpm install

# Build shared package
pnpm --filter @ecommerce/shared build

# Build individual services
pnpm --filter @ecommerce/auth-service build
pnpm --filter @ecommerce/users-service build

# Docker operations
docker-compose up --build -d        # Full deployment
docker-compose ps                   # Check status
docker-compose logs [service-name]  # View logs
docker-compose down                 # Stop everything