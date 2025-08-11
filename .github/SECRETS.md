# GitHub Secrets Configuration Guide

# دليل إعداد الأسرار في GitHub للـ CI/CD Pipeline

## Required Secrets for CI/CD Pipeline

يجب إضافة هذه الأسرار في GitHub Repository Settings > Secrets and variables > Actions:

### 1. أسرار النشر للـ EC2

```
EC2_HOST
- Description: عنوان IP أو hostname للخادم EC2
- Example: ec2-52-14-98-152.us-east-2.compute.amazonaws.com

EC2_USER
- Description: اسم المستخدم للاتصال بالخادم
- Example: ubuntu

EC2_PRIVATE_KEY
- Description: المفتاح الخاص للـ SSH (محتوى ملف .pem)
- Example: محتوى ملف ecommerce-test-ssh.pem كاملاً
```

### 2. أسرار قاعدة البيانات (اختيارية للإنتاج)

```
POSTGRES_PASSWORD_PROD
- Description: كلمة مرور قاعدة البيانات للإنتاج
- Example: super_secure_prod_password_2024

JWT_SECRET_PROD
- Description: مفتاح JWT للإنتاج
- Example: ultra_secure_jwt_secret_for_production_2024

REDIS_PASSWORD_PROD
- Description: كلمة مرور Redis للإنتاج (اختيارية)
- Example: redis_secure_password_2024
```

### 3. متغيرات البيئة العامة

في Repository Settings > Secrets and variables > Actions > Variables:

```
DEPLOYMENT_URL
- Description: رابط الموقع بعد النشر
- Example: http://ec2-52-14-98-152.us-east-2.compute.amazonaws.com

DOCKER_REGISTRY
- Description: سجل الـ Docker (افتراضي: ghcr.io)
- Example: ghcr.io

APP_ENV
- Description: بيئة التطبيق
- Example: production
```

## How to Add Secrets

### خطوات إضافة الأسرار:

1. **اذهب إلى Repository في GitHub**
2. **اضغط على Settings**
3. **من القائمة الجانبية، اختر Secrets and variables > Actions**
4. **اضغط على New repository secret**
5. **أدخل Name و Value**
6. **اضغط Add secret**

### خطوات الحصول على المفتاح الخاص للـ EC2:

```bash
# عرض محتوى المفتاح الخاص
cat ~/.ssh/ecommerce-test-ssh.pem

# انسخ المحتوى كاملاً (من -----BEGIN إلى -----END)
# والصقه في GitHub Secret: EC2_PRIVATE_KEY
```

## Security Best Practices

### 🔒 أمان الأسرار:

1. **لا تضع أسرار حقيقية في الكود**
2. **استخدم أسرار GitHub لجميع البيانات الحساسة**
3. **غيّر الأسرار دورياً**
4. **استخدم permissions محددة للـ workflows**
5. **راجع logs الـ Actions للتأكد من عدم تسريب أسرار**

### 🛡️ إعدادات الأمان:

```yaml
# في workflow files، استخدم دائماً:
password: ${{ secrets.SECRET_NAME }}

# وليس:
password: "hard-coded-password"
```

### 🔍 فحص الأسرار:

```bash
# للتأكد من أن الأسرار تعمل، يمكن اختبارها:
echo "Testing connection to EC2..."
ssh -i ~/.ssh/deploy_key $EC2_USER@$EC2_HOST "echo 'Connection successful'"
```

## Environment-specific Configurations

### Development Environment

```yaml
environment: development
secrets:
  - EC2_HOST_DEV
  - EC2_USER_DEV
  - EC2_PRIVATE_KEY_DEV
```

### Production Environment

```yaml
environment: production
secrets:
  - EC2_HOST
  - EC2_USER
  - EC2_PRIVATE_KEY
  - POSTGRES_PASSWORD_PROD
  - JWT_SECRET_PROD
```

## Troubleshooting

### مشاكل شائعة وحلولها:

1. **SSH Connection Failed:**
   - تأكد من صحة EC2_PRIVATE_KEY
   - تأكد من صحة EC2_HOST و EC2_USER
   - تأكد من أن Security Group يسمح بـ SSH (port 22)

2. **Docker Build Failed:**
   - تأكد من وجود ذاكرة كافية على EC2
   - تأكد من صحة docker-compose.yml

3. **Deployment Failed:**
   - تحقق من permissions المستخدم على EC2
   - تأكد من تثبيت Docker و Docker Compose

### أوامر مفيدة للتشخيص:

```bash
# فحص اتصال SSH
ssh -i ~/.ssh/ecommerce-test-ssh.pem ubuntu@$EC2_HOST "docker --version"

# فحص حالة الخدمات
ssh -i ~/.ssh/ecommerce-test-ssh.pem ubuntu@$EC2_HOST "cd ecommerce-ms-app && docker-compose ps"

# عرض سجلات الخدمات
ssh -i ~/.ssh/ecommerce-test-ssh.pem ubuntu@$EC2_HOST "cd ecommerce-ms-app && docker-compose logs --tail=50"
```
