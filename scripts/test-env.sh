#!/bin/bash

# Quick Environment Test Script
# Tests health endpoints for development or production environment

set -e

ENVIRONMENT=${1:-dev}
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🧪 Testing $ENVIRONMENT environment..."

case $ENVIRONMENT in
  "dev"|"development")
    echo "🔍 Testing development services (direct ports)..."
    
    # Check if containers are running
    if ! docker ps | grep -q "ecommerce-ms-app-auth-service"; then
      echo "❌ Development environment not running"
      echo "💡 Run: pnpm docker:dev"
      exit 1
    fi
    
    echo "Testing auth service..."
    if curl -s http://localhost:3001/health | grep -q '"status":"ok"'; then
      echo "✅ Auth Service (http://localhost:3001)"
    else
      echo "❌ Auth Service failed"
    fi
    
    echo "Testing users service..."
    if curl -s http://localhost:3002/health | grep -q '"status":"ok"'; then
      echo "✅ Users Service (http://localhost:3002)"
    else
      echo "❌ Users Service failed"
    fi
    
    echo "Testing gateway..."
    if curl -s http://localhost:8080/auth/health | grep -q '"status":"ok"'; then
      echo "✅ Gateway -> Auth (http://localhost:8080/auth)"
    else
      echo "❌ Gateway -> Auth failed"
    fi
    ;;
    
  "prod"|"production")
    echo "🔍 Testing production services (via gateway)..."
    
    # Check if nginx gateway is running
    if ! docker ps | grep -q "nginx-gateway-prod"; then
      echo "❌ Production environment not running"
      echo "💡 Run: pnpm docker:prod"
      exit 1
    fi
    
    echo "Testing auth service via gateway..."
    if curl -s http://localhost/auth/health | grep -q '"status":"ok"'; then
      echo "✅ Auth Service (http://localhost/auth)"
    else
      echo "❌ Auth Service via gateway failed"
    fi
    
    echo "Testing users service via gateway..."
    if curl -s http://localhost/users/health | grep -q '"status":"ok"'; then
      echo "✅ Users Service (http://localhost/users)"
    else
      echo "❌ Users Service via gateway failed"
    fi
    ;;
    
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "📖 Usage: $0 [dev|prod]"
    exit 1
    ;;
esac

echo ""
echo "🎉 $ENVIRONMENT environment test complete!"
