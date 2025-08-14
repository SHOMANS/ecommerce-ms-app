#!/bin/bash

# Environment Setup Script for Ecommerce Microservices
# Usage: ./scripts/setup-env.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Setting up environment for: $ENVIRONMENT"
echo "📁 Root directory: $ROOT_DIR"

case $ENVIRONMENT in
  "dev"|"development")
    echo "📋 Setting up development environment..."
    if [ ! -f "$ROOT_DIR/.env.development" ]; then
      cp "$ROOT_DIR/.env.development.sample" "$ROOT_DIR/.env.development"
      echo "✅ Created .env.development from sample"
      echo "💡 You can customize values in .env.development if needed"
    else
      echo "ℹ️  .env.development already exists"
    fi
    
    echo "🔧 Development environment ready!"
    echo "📝 Run: pnpm docker:dev (starts all services with debug logging)"
    echo "🌐 Services available at:"
    echo "   - Auth Service: http://localhost:3001"
    echo "   - Users Service: http://localhost:3002"
    echo "   - Gateway: http://localhost:8080"
    ;;
    
  "prod"|"production")
    echo "🏭 Setting up production environment..."
    if [ ! -f "$ROOT_DIR/.env.production" ]; then
      cp "$ROOT_DIR/.env.production.sample" "$ROOT_DIR/.env.production"
      echo "✅ Created .env.production from sample"
      echo "⚠️  WARNING: Please update passwords and secrets in .env.production!"
    else
      echo "ℹ️  .env.production already exists"
    fi
    
    echo "🏭 Production environment ready!"
    echo "📝 Run: pnpm docker:prod (starts optimized production build)"
    echo "� Services available at:"
    echo "   - Gateway: http://localhost (port 80)"
    echo "🔒 IMPORTANT: Review and update all passwords and secrets before deployment!"
    ;;
    
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "📖 Usage: $0 [dev|prod]"
    echo ""
    echo "Available environments:"
    echo "  dev       - Development environment with debug logging and direct service access"
    echo "  prod      - Production environment with optimized build and gateway-only access"
    exit 1
    ;;
esac

echo ""
echo "🔍 Current environment files:"
ls -la "$ROOT_DIR"/.env.development "$ROOT_DIR"/.env.production 2>/dev/null || echo "Environment files missing"

echo ""
echo "✨ Setup complete! Environment: $ENVIRONMENT"

# Run validation automatically
echo ""
echo "🔍 Running environment validation..."
"$ROOT_DIR/scripts/validate-env.sh" "$ENVIRONMENT"
