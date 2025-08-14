# E-commerce Microservices App

A modern microservices architecture built with NestJS, PostgreSQL, Redis, and Kafka.

## 🏗️ Architecture

```
├── apps/
│   ├── auth-service/       # Authentication & JWT (Port 3001)
│   └── users-service/      # User management (Port 3002)
├── packages/shared/        # Common utilities and types
├── gateway/               # Nginx reverse proxy
└── db/                   # Database initialization
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and pnpm 10+
- Docker & Docker Compose

### Environment Setup

**Automated Setup (Recommended)**
```bash
# Development environment
pnpm setup:dev

# Production environment
pnpm setup:prod
```

**Manual Setup**
```bash
# Copy environment files
cp .env.development.sample .env.development
cp .env.production.sample .env.production

# Edit values as needed (change passwords for production!)
nano .env.development
nano .env.production
```

### Validation & Testing

```bash
# Validate environment configuration
pnpm validate:dev     # Check development setup
pnpm validate:prod    # Check production setup

# Test running services
pnpm test:dev         # Test development environment
pnpm test:prod        # Test production environment
```

## 🐳 Running with Docker

### Development Environment
```bash
# Setup and start (includes validation)
pnpm setup:dev
pnpm docker:dev

# Test services
pnpm test:dev

# View logs
pnpm docker:dev:logs

# Stop services
pnpm docker:dev:down
```

### Production Environment
```bash
# Setup and start (includes validation)
pnpm setup:prod
pnpm docker:prod

# Test services (via gateway only)
pnpm test:prod

# View logs  
pnpm docker:prod:logs

# Stop services
pnpm docker:prod:down
```

**Production URLs:**
- Gateway: http://localhost
- Auth API: http://localhost/auth
- Users API: http://localhost/users

# Stop services
pnpm docker:prod:down
```

## 🔧 Local Development (without Docker)

1. **Start infrastructure services**
   ```bash
   docker compose -f docker-compose.dev.yml up postgres redis kafka -d
   ```

2. **Install and build**
   ```bash
   pnpm install
   pnpm build
   ```

3. **Start services**
   ```bash
   # Start both services in development mode
   pnpm dev
   
   # Or individually
   cd apps/auth-service && pnpm start:dev
   cd apps/users-service && pnpm start:dev
   ```

## 📡 API Endpoints

### Development URLs
- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:3001
- **Users Service**: http://localhost:3002

### Production URLs  
- **API Gateway**: http://localhost (port 80)

### Health Checks
- Auth Service: `GET /health`
- Users Service: `GET /health`

## 🗃️ Environment Variables

### Required for Production (change these!)
```bash
# Database
POSTGRES_PASSWORD=your_secure_password
AUTH_DB_PASSWORD=auth_db_password  
USERS_DB_PASSWORD=users_db_password

# Security
JWT_SECRET=your_super_secure_jwt_secret
REDIS_PASSWORD=secure_redis_password
```

### Key Configuration
| Variable | Development | Production |
|----------|-------------|------------|
| `POSTGRES_PASSWORD` | `root` | **Change required** |
| `JWT_SECRET` | `development_secret_key` | **Change required** |
| `NODE_ENV` | `development` | `production` |
| `NGINX_PORT` | `8080` | `80` |

## 🛠️ Available Scripts

```bash
# Development
pnpm docker:dev              # Start development environment
pnpm docker:dev:build        # Build and start development  
pnpm docker:dev:logs         # View development logs
pnpm docker:dev:down         # Stop development environment

# Production
pnpm docker:prod             # Start production environment
pnpm docker:prod:build       # Build and start production
pnpm docker:prod:logs        # View production logs  
pnpm docker:prod:down        # Stop production environment

# Local development
pnpm install                 # Install dependencies
pnpm build                   # Build all services
pnpm dev                     # Start services in development mode
pnpm lint                    # Lint code
pnpm clean                   # Clean build artifacts
```

## 🔒 Security Notes
