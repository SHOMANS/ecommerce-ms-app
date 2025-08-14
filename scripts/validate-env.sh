#!/bin/bash

# Environment Validation Script
# Checks if required environment variables are set and files exist
# Usage: ./scripts/validate-env.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔍 Environment Validation ($ENVIRONMENT)"
echo "======================================"

# Determine which .env file to check
case $ENVIRONMENT in
  "dev"|"development")
    ENV_FILE="$ROOT_DIR/.env.development"
    SAMPLE_FILE="$ROOT_DIR/.env.development.sample"
    ;;
  "prod"|"production")
    ENV_FILE="$ROOT_DIR/.env.production"
    SAMPLE_FILE="$ROOT_DIR/.env.production.sample"
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "📖 Usage: $0 [dev|prod]"
    exit 1
    ;;
esac

# Check if environment file exists
if [ -f "$ENV_FILE" ]; then
    echo "✅ $ENV_FILE exists"
    
    # Source the environment file
    set -a
    source "$ENV_FILE"
    set +a
    
    # Check critical variables
    echo ""
    echo "🔑 Environment Variables:"
    echo "NODE_ENV: ${NODE_ENV:-❌ NOT SET}"
    echo "AUTH_SERVICE_PORT: ${AUTH_SERVICE_PORT:-❌ NOT SET}"
    echo "USERS_SERVICE_PORT: ${USERS_SERVICE_PORT:-❌ NOT SET}"
    echo "POSTGRES_HOST: ${POSTGRES_HOST:-❌ NOT SET}"
    echo "POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:+✅ SET}${POSTGRES_PASSWORD:-❌ NOT SET}"
    echo "JWT_SECRET: ${JWT_SECRET:+✅ SET}${JWT_SECRET:-❌ NOT SET}"
    echo "KAFKA_BROKERS: ${KAFKA_BROKERS:-❌ NOT SET}"
    echo "REDIS_HOST: ${REDIS_HOST:-❌ NOT SET}"
    
    # Validate production security
    if [ "$NODE_ENV" = "production" ]; then
        echo ""
        echo "🔒 Production Security Check:"
        
        if [[ "$JWT_SECRET" == *"CHANGE_THIS"* || "$JWT_SECRET" == *"change"* || "$JWT_SECRET" == *"your-super-secret"* ]]; then
            echo "❌ JWT_SECRET appears to be a default/dev value - CHANGE IT!"
        else
            echo "✅ JWT_SECRET appears to be customized"
        fi
        
        if [[ "$POSTGRES_PASSWORD" == *"CHANGE_THIS"* || "$POSTGRES_PASSWORD" == "root" ]]; then
            echo "❌ POSTGRES_PASSWORD appears to be default - CHANGE IT!"
        else
            echo "✅ POSTGRES_PASSWORD appears to be customized"
        fi
        
        if [[ "$REDIS_PASSWORD" == *"CHANGE_THIS"* || "$REDIS_PASSWORD" == "redis" ]]; then
            echo "❌ REDIS_PASSWORD appears to be default - CHANGE IT!"
        else
            echo "✅ REDIS_PASSWORD appears to be customized"
        fi
    fi
    
else
    echo "❌ $ENV_FILE not found"
    echo "💡 Run: pnpm setup:$ENVIRONMENT"
    exit 1
fi

# Check sample file
echo ""
echo "📝 Sample Files:"
if [ -f "$SAMPLE_FILE" ]; then
    echo "✅ $SAMPLE_FILE exists"
else
    echo "❌ $SAMPLE_FILE missing"
fi

# Check Docker Compose files
echo ""
echo "🐳 Docker Files:"
for compose in docker-compose.yml docker-compose.dev.yml; do
    if [ -f "$ROOT_DIR/$compose" ]; then
        echo "✅ $compose exists"
    else
        echo "❌ $compose missing"
    fi
done

echo ""
echo "🎯 Validation complete for $ENVIRONMENT environment!"
