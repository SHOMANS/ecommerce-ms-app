#!/bin/bash

# سكريبت اختبار الخدمات في CI/CD Pipeline
# يتأكد من أن جميع الخدمات تعمل بشكل صحيح

set -e

echo "🧪 بدء اختبار الخدمات..."

# انتظار حتى تصبح الخدمات جاهزة
echo "⏳ انتظار تشغيل الخدمات..."
sleep 30

# متغيرات
GATEWAY_URL="http://localhost:8080"
AUTH_URL="http://localhost:3001"
USERS_URL="http://localhost:3002"

# دالة للتحقق من صحة الاستجابة
check_health() {
    local service_name=$1
    local url=$2
    
    echo "🔍 اختبار $service_name على $url"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url/health" || echo "000")
    
    if [ "$response" = "200" ]; then
        echo "✅ $service_name يعمل بشكل صحيح"
        return 0
    else
        echo "❌ $service_name لا يعمل - رمز الاستجابة: $response"
        return 1
    fi
}

# دالة لاختبار API endpoint
test_api_endpoint() {
    local description=$1
    local method=$2
    local url=$3
    local data=$4
    local expected_code=$5
    
    echo "🧪 اختبار: $description"
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url" || echo "000")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    fi
    
    if [ "$response" = "$expected_code" ]; then
        echo "✅ $description - نجح"
        return 0
    else
        echo "❌ $description - فشل (متوقع: $expected_code، حصل على: $response)"
        return 1
    fi
}

# عداد الأخطاء
errors=0

# اختبار الخدمات الأساسية
echo "📋 اختبار Health Checks..."

check_health "Gateway" "$GATEWAY_URL" || ((errors++))
check_health "Auth Service" "$AUTH_URL" || ((errors++))
check_health "Users Service" "$USERS_URL" || ((errors++))

# اختبار APIs
echo "📋 اختبار APIs..."

# اختبار تسجيل مستخدم جديد
test_user_email="ci-test-$(date +%s)@example.com"
signup_data='{"email":"'$test_user_email'","password":"testpass123"}'

test_api_endpoint "User Signup via Gateway" "POST" "$GATEWAY_URL/auth/signup" "$signup_data" "201" || ((errors++))

# اختبار تسجيل الدخول
signin_data='{"email":"'$test_user_email'","password":"testpass123"}'

# اختبار signin مع التحقق من response code مرن
echo "🧪 اختبار: User Signin via Gateway"
signin_response_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$signin_data" \
    "$GATEWAY_URL/auth/signin" || echo "000")

if [ "$signin_response_code" = "200" ] || [ "$signin_response_code" = "201" ]; then
    echo "✅ User Signin via Gateway - نجح (كود: $signin_response_code)"
else
    echo "❌ User Signin via Gateway - فشل (متوقع: 200 أو 201، حصل على: $signin_response_code)"
    ((errors++))
fi

# اختبار الحصول على جميع المستخدمين
test_api_endpoint "Get All Users" "GET" "$USERS_URL/users/all" "" "200" || ((errors++))

# اختبار قاعدة البيانات والاتصالات
echo "📋 اختبار قواعد البيانات والاتصالات..."

# التحقق من اتصال PostgreSQL
echo "🔍 اختبار اتصال PostgreSQL..."
if docker compose exec -T postgres pg_isready -U postgres; then
    echo "✅ PostgreSQL متصل"
else
    echo "❌ PostgreSQL غير متصل"
    ((errors++))
fi

# التحقق من اتصال Redis
echo "🔍 اختبار اتصال Redis..."
if docker compose exec -T redis redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis متصل"
else
    echo "❌ Redis غير متصل"
    ((errors++))
fi

# التحقق من اتصال Kafka
echo "🔍 اختبار اتصال Kafka..."
if docker compose exec -T kafka kafka-topics.sh --bootstrap-server localhost:9092 --list >/dev/null 2>&1; then
    echo "✅ Kafka متصل"
else
    echo "❌ Kafka غير متصل"
    ((errors++))
fi

# اختبار التكامل بين الخدمات (Kafka messaging)
echo "📋 اختبار تكامل الخدمات..."

# اختبار signin الذي يستخدم Kafka للتواصل بين auth و users services
echo "🔍 اختبار تكامل Kafka بين الخدمات..."
signin_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$signin_data" \
    "$GATEWAY_URL/auth/signin")

if echo "$signin_response" | grep -q "createdAt"; then
    echo "✅ تكامل Kafka يعمل - signin يحصل على بيانات من users service"
else
    echo "❌ تكامل Kafka لا يعمل - signin لا يحصل على بيانات كاملة"
    ((errors++))
fi

# عرض النتائج النهائية
echo ""
echo "📊 نتائج الاختبار:"
echo "=================="

if [ $errors -eq 0 ]; then
    echo "🎉 جميع الاختبارات نجحت!"
    echo "✅ النظام جاهز للإنتاج"
    exit 0
else
    echo "❌ فشل $errors اختبار(ات)"
    echo "🔧 يرجى مراجعة السجلات والإصلاح"
    
    # عرض سجلات الخدمات في حالة الفشل
    echo ""
    echo "📋 سجلات الخدمات:"
    echo "=================="
    docker compose logs --tail=20 auth-service
    echo "---"
    docker compose logs --tail=20 users-service
    
    exit 1
fi
