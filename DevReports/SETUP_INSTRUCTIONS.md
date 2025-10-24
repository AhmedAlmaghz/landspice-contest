# 🚀 تعليمات الإعداد - LandSpice Contest SaaS

**التاريخ:** 2025-10-23  
**المرحلة:** 1 - إعداد البيئة والتبعيات

---

## 📋 الخطوة 1: تثبيت التبعيات الجديدة

### 1.1 التبعيات الأساسية الجديدة

```bash
# نظام الدفع
npm install stripe

# قاعدة البيانات
npm install pg
npm install @prisma/client prisma

# التخزين المؤقت
npm install redis

# التحقق من البيانات
npm install zod

# متغيرات البيئة
npm install dotenv

# الاختبارات
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# أدوات التطوير
npm install --save-dev ts-node
```

### 1.2 الأمر الكامل

```bash
npm install stripe pg @prisma/client prisma redis zod dotenv
npm install --save-dev jest @testing-library/react @testing-library/jest-dom ts-node
```

---

## 📝 الخطوة 2: إعداد متغيرات البيئة

### 2.1 إنشاء ملف `.env.local`

في جذر المشروع، أنشئ ملف `.env.local` بالمحتوى التالي:

```env
# ========== Database ==========
DATABASE_URL="postgresql://user:password@localhost:5432/landspice_saas"

# ========== Redis ==========
REDIS_URL="redis://localhost:6379"

# ========== Stripe ==========
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# ========== Social APIs ==========
FACEBOOK_API_KEY="your_facebook_api_key"
FACEBOOK_API_SECRET="your_facebook_api_secret"

INSTAGRAM_ACCESS_TOKEN="your_instagram_access_token"

YOUTUBE_API_KEY="your_youtube_api_key"

TIKTOK_ACCESS_TOKEN="your_tiktok_access_token"
TIKTOK_CLIENT_KEY="your_tiktok_client_key"

TWITTER_BEARER_TOKEN="your_twitter_bearer_token"

# ========== JWT ==========
JWT_SECRET="your_jwt_secret_key_min_32_characters"
JWT_EXPIRATION="7d"

# ========== App Configuration ==========
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"

# ========== Webhook Secrets ==========
WEBHOOK_SECRET="your_webhook_secret_key"
```

---

## 🗄️ الخطوة 3: إعداد قاعدة البيانات

### 3.1 تثبيت PostgreSQL

**على Windows:**
```bash
# استخدام Chocolatey
choco install postgresql

# أو تحميل من
https://www.postgresql.org/download/windows/
```

**على macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**على Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3.2 إنشاء قاعدة البيانات

```bash
# الاتصال بـ PostgreSQL
psql -U postgres

# إنشاء قاعدة البيانات
CREATE DATABASE landspice_saas;
CREATE USER landspice_user WITH PASSWORD 'your_secure_password';
ALTER ROLE landspice_user SET client_encoding TO 'utf8';
ALTER ROLE landspice_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE landspice_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE landspice_saas TO landspice_user;

# الخروج
\q
```

### 3.3 تحديث DATABASE_URL

```env
DATABASE_URL="postgresql://landspice_user:your_secure_password@localhost:5432/landspice_saas"
```

---

## 🗂️ الخطوة 4: إعداد Prisma ORM

### 4.1 تهيئة Prisma

```bash
npx prisma init
```

### 4.2 إنشاء ملف `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== Companies ==========
model Company {
  id                      String    @id @default(cuid())
  name                    String
  email                   String    @unique
  phone                   String?
  country                 String?
  city                    String?
  logoUrl                 String?
  description             String?
  websiteUrl              String?
  subscriptionPlan        String    @default("free") // free, pro, enterprise
  subscriptionStatus      String    @default("active") // active, inactive, cancelled
  subscriptionStartDate   DateTime  @default(now())
  subscriptionEndDate     DateTime?
  settings                Json      @default("{}")
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
  deletedAt               DateTime?

  contests                Contest[]
  participants            Participant[]
  payments                Payment[]

  @@index([email])
  @@index([subscriptionStatus])
}

// ========== Contests ==========
model Contest {
  id                      String    @id @default(cuid())
  companyId               String
  company                 Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  title                   String
  description             String?
  bannerUrl               String?
  startDate               DateTime
  endDate                 DateTime
  prizeDescription        String?
  maxParticipants         Int?
  requireEmailVerification Boolean  @default(true)
  status                  String    @default("draft") // draft, active, ended, cancelled
  
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
  deletedAt               DateTime?

  platforms               SocialPlatform[]
  participants            Participant[]
  socialActions           SocialAction[]
  winners                 Winner[]

  @@index([companyId])
  @@index([status])
  @@index([endDate])
}

// ========== Social Platforms ==========
model SocialPlatform {
  id                      String    @id @default(cuid())
  contestId               String
  contest                 Contest   @relation(fields: [contestId], references: [id], onDelete: Cascade)
  
  name                    String    // facebook, instagram, youtube, tiktok, twitter, custom
  displayName             String
  url                     String
  iconUrl                 String?
  actionType              String    // follow, like, share, subscribe, custom
  actionDescription       String?
  autoVerify              Boolean   @default(false)
  verificationMethod      String    @default("manual") // api, webhook, manual
  orderIndex              Int       @default(0)
  isActive                Boolean   @default(true)
  
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  socialActions           SocialAction[]

  @@index([contestId])
  @@index([isActive])
}

// ========== Participants ==========
model Participant {
  id                      String    @id @default(cuid())
  contestId               String
  contest                 Contest   @relation(fields: [contestId], references: [id], onDelete: Cascade)
  companyId               String
  company                 Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  name                    String
  email                   String
  phone                   String?
  city                    String?
  referralCode            String    @unique
  referredBy              String?
  
  progress                Int       @default(0)
  shares                  Int       @default(0)
  referrals               Int       @default(0)
  
  emailVerified           Boolean   @default(false)
  verifiedAt              DateTime?
  registrationDate        DateTime  @default(now())
  lastActivityDate        DateTime?

  socialActions           SocialAction[]
  referredParticipants    Participant[] @relation("Referrals")
  referrer                Participant?  @relation("Referrals", fields: [referredBy], references: [referralCode])

  @@unique([contestId, email])
  @@index([contestId])
  @@index([companyId])
  @@index([email])
  @@index([referralCode])
}

// ========== Social Actions ==========
model SocialAction {
  id                      String    @id @default(cuid())
  participantId           String
  participant             Participant @relation(fields: [participantId], references: [id], onDelete: Cascade)
  platformId              String
  platform                SocialPlatform @relation(fields: [platformId], references: [id], onDelete: Cascade)
  contestId               String
  contest                 Contest   @relation(fields: [contestId], references: [id], onDelete: Cascade)
  
  actionType              String
  isVerified              Boolean   @default(false)
  verificationMethod      String?
  verifiedAt              DateTime?
  verificationData        Json?
  actionDate              DateTime  @default(now())

  @@unique([participantId, platformId])
  @@index([participantId])
  @@index([platformId])
  @@index([isVerified])
}

// ========== Winners ==========
model Winner {
  id                      String    @id @default(cuid())
  contestId               String
  contest                 Contest   @relation(fields: [contestId], references: [id], onDelete: Cascade)
  participantId           String
  
  position                Int
  prizeDescription        String?
  drawDate                DateTime  @default(now())
  announced               Boolean   @default(false)
  announcedAt             DateTime?

  @@unique([contestId, participantId])
  @@index([contestId])
}

// ========== Payments ==========
model Payment {
  id                      String    @id @default(cuid())
  companyId               String
  company                 Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  stripePaymentIntentId   String?
  stripeSubscriptionId    String?
  stripeCustomerId        String?
  
  amount                  Float
  currency                String    @default("usd")
  status                  String    @default("pending") // pending, succeeded, failed
  planId                  String?
  
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  @@index([companyId])
  @@index([status])
}
```

### 4.3 تشغيل Migrations

```bash
npx prisma migrate dev --name init
```

---

## 🔧 الخطوة 5: تحديث package.json

أضف هذه الـ scripts إلى `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "db:push": "prisma db push",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

---

## ✅ التحقق من الإعداد

```bash
# 1. التحقق من التبعيات
npm list stripe pg redis zod

# 2. التحقق من قاعدة البيانات
psql -U landspice_user -d landspice_saas -c "SELECT 1"

# 3. التحقق من Prisma
npx prisma db push

# 4. تشغيل التطبيق
npm run dev
```

---

## 🚀 الخطوة التالية

بعد إكمال هذه الخطوات:

1. ✅ التبعيات مثبتة
2. ✅ قاعدة البيانات جاهزة
3. ✅ Prisma مهيأ
4. ✅ متغيرات البيئة معدة

**الخطوة التالية:** ربط الخدمات بقاعدة البيانات

---

**التاريخ:** 2025-10-23  
**المرحلة:** 1 - إعداد البيئة  
**الحالة:** جاهز للتطبيق
