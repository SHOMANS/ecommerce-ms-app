#!/bin/bash

# Environment Setup Script for Ecommerce Microservices
# Usage: ./scripts/setup-env.sh [dev|prod|local]

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
    else
      echo "ℹ️  .env.development already exists"
    fi
    
    # Also create .env for fallback
    if [ ! -f "$ROOT_DIR/.env" ]; then
      cp "$ROOT_DIR/.env.development.sample" "$ROOT_DIR/.env"
      echo "✅ Created .env from development sample"
    fi
    
    echo "🔧 Development environment ready!"
    echo "📝 You can now run: docker-compose -f docker-compose.dev.yml up"
    ;;
    
  "prod"|"production")
    echo "🏭 Setting up production environment..."
    if [ ! -f "$ROOT_DIR/.env.production" ]; then
      cp "$ROOT_DIR/.env.production.sample" "$ROOT_DIR/.env.production"
      echo "✅ Created .env.production from sample"
      echo "⚠️  WARNING: Please update passwords and secrets in .env.production before deploying!"
    else
      echo "ℹ️  .env.production already exists"
    fi
    
    # Create .env for production
    if [ ! -f "$ROOT_DIR/.env" ]; then
      cp "$ROOT_DIR/.env.production.sample" "$ROOT_DIR/.env"
      echo "✅ Created .env from production sample"
      echo "⚠️  WARNING: Please update passwords and secrets in .env before deploying!"
    fi
    
    echo "🏭 Production environment ready!"
    echo "📝 You can now run: docker-compose up --build"
    echo "🔒 IMPORTANT: Review and update all passwords and secrets before deployment!"
    ;;
    
  "local")
    echo "💻 Setting up local environment..."
    if [ ! -f "$ROOT_DIR/.env" ]; then
      cp "$ROOT_DIR/.env.sample" "$ROOT_DIR/.env"
      echo "✅ Created .env from sample"
    else
      echo "ℹ️  .env already exists"
    fi
    
    echo "💻 Local environment ready!"
    echo "📝 You can now run local development commands"
    ;;
    
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "📖 Usage: $0 [dev|prod|local]"
    echo ""
    echo "Available environments:"
    echo "  dev       - Development environment with debug logging"
    echo "  prod      - Production environment with security settings"
    echo "  local     - Local development environment"
    exit 1
    ;;
esac

echo ""
echo "🔍 Current environment files:"
ls -la "$ROOT_DIR"/.env* 2>/dev/null || echo "No .env files found"

echo ""
echo "✨ Setup complete! Environment: $ENVIRONMENT"
