#!/bin/bash

# Environment Validation Script
# Checks if required environment variables are set and files exist

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔍 Environment Validation"
echo "========================="

# Check if .env file exists
if [ -f "$ROOT_DIR/.env" ]; then
    echo "✅ .env file exists"
    
    # Source the .env file
    set -a
    source "$ROOT_DIR/.env"
    set +a
    
    # Check critical variables
    echo ""
    echo "🔑 Environment Variables:"
    echo "NODE_ENV: ${NODE_ENV:-❌ NOT SET}"
    echo "POSTGRES_HOST: ${POSTGRES_HOST:-❌ NOT SET}"
    echo "POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:+✅ SET}${POSTGRES_PASSWORD:-❌ NOT SET}"
    echo "JWT_SECRET: ${JWT_SECRET:+✅ SET}${JWT_SECRET:-❌ NOT SET}"
    echo "KAFKA_BROKERS: ${KAFKA_BROKERS:-❌ NOT SET}"
    echo "REDIS_HOST: ${REDIS_HOST:-❌ NOT SET}"
    
    # Validate production security
    if [ "$NODE_ENV" = "production" ]; then
        echo ""
        echo "🔒 Production Security Check:"
        
        if [[ "$JWT_SECRET" == *"CHANGE_THIS"* || "$JWT_SECRET" == *"change"* || "$JWT_SECRET" == *"dev"* ]]; then
            echo "❌ JWT_SECRET appears to be a default/dev value - CHANGE IT!"
        else
            echo "✅ JWT_SECRET appears to be customized"
        fi
        
        if [[ "$POSTGRES_PASSWORD" == *"CHANGE_THIS"* || "$POSTGRES_PASSWORD" == "root" ]]; then
            echo "❌ POSTGRES_PASSWORD appears to be default - CHANGE IT!"
        else
            echo "✅ POSTGRES_PASSWORD appears to be customized"
        fi
    fi
    
else
    echo "❌ .env file not found"
    echo "💡 Run: npm run setup:dev or npm run setup:prod"
fi

# Check sample files
echo ""
echo "📝 Sample Files:"
for sample in .env.sample .env.development.sample .env.production.sample; do
    if [ -f "$ROOT_DIR/$sample" ]; then
        echo "✅ $sample exists"
    else
        echo "❌ $sample missing"
    fi
done

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
echo "🎯 Validation complete!"
