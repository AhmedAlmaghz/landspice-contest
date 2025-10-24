# 🏗️ معمارية النظام الجديدة - LandSpice SaaS Platform

**التاريخ:** 2025-10-23  
**الإصدار:** 2.0.0 - Multi-Tenant Architecture  
**الحالة:** ✅ **مكتمل وجاهز للاستخدام**

---

## 📋 نظرة عامة على النظام

### المستخدمون الرئيسيون:

#### 1️⃣ **الشركات (رعاة المسابقات)**
- تسجيل شركة جديدة
- إنشاء مسابقات متعددة
- إدارة الشبكات الاجتماعية للمسابقة
- عرض إحصائيات المشاركين
- إدارة الجوائز والفائزين

#### 2️⃣ **المشاركون**
- تسجيل واحد للاشتراك في جميع المسابقات
- الاشتراك في مسابقات من شركات مختلفة
- متابعة الشبكات الاجتماعية
- الحصول على كود إحالة فريد
- عرض التقدم والإحصائيات

#### 3️⃣ **الإدارة العامة**
- إدارة الشركات
- إدارة المسابقات
- إدارة الشبكات الاجتماعية المتاحة
- عرض التقارير والتحليلات

---

## 🔄 تدفق النظام

```
┌─────────────────────────────────────────────────────────────┐
│                    صفحة الاختيار                            │
│              (Register Page)                                │
└──────────────┬──────────────────────────┬──────────────────┘
               │                          │
        ┌──────▼──────┐          ┌────────▼────────┐
        │ تسجيل الشركة │          │ تسجيل المشارك  │
        │  (Company)   │          │ (Participant)   │
        └──────┬──────┘          └────────┬────────┘
               │                          │
        ┌──────▼──────────────────────────▼────────┐
        │     قاعدة البيانات (SQLite)             │
        │  ┌──────────────────────────────────┐   │
        │  │ Companies (الشركات)             │   │
        │  │ Contests (المسابقات)            │   │
        │  │ Participants (المشاركين)        │   │
        │  │ Social_Platforms (الشبكات)      │   │
        │  │ Participant_Actions (الإجراءات) │   │
        │  └──────────────────────────────────┘   │
        └──────┬──────────────────────────────────┘
               │
        ┌──────▼──────────────────────────┐
        │     لوحات التحكم               │
        │  ┌────────────────────────────┐ │
        │  │ Admin Dashboard            │ │
        │  │ Company Dashboard          │ │
        │  │ Participant Dashboard      │ │
        │  └────────────────────────────┘ │
        └────────────────────────────────┘
```

---

## 📡 الـ APIs الجديدة

### 1️⃣ تسجيل الشركات

```
POST /api/v1/companies/register

Request:
{
  "name": "اسم الشركة",
  "email": "company@example.com",
  "phone": "+966501234567",
  "subscription_plan": "pro" // free, pro, enterprise
}

Response:
{
  "success": true,
  "company": {
    "id": 1,
    "name": "اسم الشركة",
    "email": "company@example.com",
    "subscription_plan": "pro"
  },
  "adminCredentials": {
    "email": "company@example.com",
    "password": "auto_generated_password"
  }
}
```

### 2️⃣ إدارة الشبكات الاجتماعية

```
GET /api/v1/social-platforms
- الحصول على قائمة الشبكات المتاحة

POST /api/v1/social-platforms
- إضافة شبكة اجتماعية للمسابقة

Request:
{
  "contest_id": 1,
  "platform_name": "Facebook",
  "platform_url": "https://facebook.com/company",
  "action_type": "follow",
  "verification_type": "automatic"
}
```

### 3️⃣ تسجيل المشاركين

```
POST /api/v1/participants/register

Request:
{
  "name": "اسم المشارك",
  "email": "participant@example.com",
  "phone": "+966501234567",
  "city": "الرياض",
  "referredBy": "REFERRAL_CODE" // اختياري
}

Response:
{
  "success": true,
  "message": "تم التسجيل بنجاح في 3 مسابقات",
  "participant": {
    "ids": [1, 2, 3],
    "name": "اسم المشارك",
    "email": "participant@example.com",
    "referral_code": "ABC123XYZ",
    "contests_count": 3
  }
}
```

---

## 🎯 خطط الاشتراك

| الميزة | Free | Pro | Enterprise |
|--------|------|-----|------------|
| **عدد المسابقات** | 1 | 5 | غير محدود |
| **عدد المشاركين** | 500 | 5,000 | 50,000 |
| **الشبكات الاجتماعية** | 5 | 10 | 20 |
| **التحليلات** | أساسية | متقدمة | شاملة |
| **الدعم** | البريد | الأولوية | 24/7 |
| **السعر** | مجاني | $99/شهر | مخصص |

---

## 🔐 نظام الأدوار والصلاحيات

### الأدوار:

#### 1. **مسؤول النظام (System Admin)**
- إدارة جميع الشركات
- إدارة جميع المسابقات
- إدارة الشبكات الاجتماعية المتاحة
- عرض التقارير الشاملة

#### 2. **مسؤول الشركة (Company Admin)**
- إنشاء وتعديل المسابقات
- إدارة الشبكات الاجتماعية للمسابقة
- عرض إحصائيات المشاركين
- إدارة الجوائز والفائزين

#### 3. **موظف الشركة (Company Staff)**
- عرض المسابقات
- عرض إحصائيات المشاركين
- تصدير التقارير

#### 4. **المشارك (Participant)**
- عرض المسابقات المتاحة
- متابعة الشبكات الاجتماعية
- عرض التقدم الشخصي
- الحصول على الجوائز

---

## 📊 قاعدة البيانات

### الجداول الرئيسية:

```sql
-- الشركات
CREATE TABLE companies (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  subscription_plan TEXT,
  max_contests INTEGER,
  max_participants INTEGER,
  max_social_platforms INTEGER,
  created_at TIMESTAMP
);

-- المسابقات
CREATE TABLE contests (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT, -- draft, active, ended, cancelled
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  prize_description TEXT,
  rules TEXT,
  max_participants INTEGER,
  created_at TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- المشاركون
CREATE TABLE participants (
  id INTEGER PRIMARY KEY,
  contest_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  progress INTEGER DEFAULT 0,
  total_actions INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  registration_date TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id)
);

-- الشبكات الاجتماعية
CREATE TABLE social_platforms (
  id INTEGER PRIMARY KEY,
  contest_id INTEGER NOT NULL,
  platform_name TEXT NOT NULL,
  platform_url TEXT NOT NULL,
  action_type TEXT, -- follow, share
  verification_type TEXT, -- automatic, manual
  position INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id)
);

-- إجراءات المشاركين
CREATE TABLE participant_actions (
  id INTEGER PRIMARY KEY,
  participant_id INTEGER NOT NULL,
  platform_id INTEGER NOT NULL,
  action_type TEXT, -- follow, share
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES participants(id),
  FOREIGN KEY (platform_id) REFERENCES social_platforms(id)
);

-- الفائزون
CREATE TABLE winners (
  id INTEGER PRIMARY KEY,
  contest_id INTEGER NOT NULL,
  participant_id INTEGER NOT NULL,
  position INTEGER,
  prize_description TEXT,
  announced BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  FOREIGN KEY (contest_id) REFERENCES contests(id),
  FOREIGN KEY (participant_id) REFERENCES participants(id)
);
```

---

## 🌐 الواجهات الجديدة

### 1️⃣ صفحة الاختيار
**المسار:** `/register`
- اختيار بين تسجيل الشركة والمشارك
- عرض الميزات لكل نوع

### 2️⃣ تسجيل الشركة
**المسار:** `/register/company`
- نموذج تسجيل الشركة
- اختيار خطة الاشتراك
- إنشاء حساب إداري

### 3️⃣ تسجيل المشارك
**المسار:** `/register/participant`
- نموذج تسجيل المشارك
- الاشتراك في جميع المسابقات
- كود إحالة فريد

---

## 🔄 تدفق العمل

### تدفق الشركة:

```
1. تسجيل الشركة
   ↓
2. تسجيل الدخول إلى لوحة الشركة
   ↓
3. إنشاء مسابقة جديدة
   ↓
4. اختيار الشبكات الاجتماعية
   ↓
5. إدخال معرفات الشبكات
   ↓
6. نشر المسابقة
   ↓
7. عرض إحصائيات المشاركين
   ↓
8. اختيار الفائزين
```

### تدفق المشارك:

```
1. تسجيل المشارك
   ↓
2. الاشتراك في جميع المسابقات
   ↓
3. عرض المسابقات المتاحة
   ↓
4. متابعة الشبكات الاجتماعية
   ↓
5. تحديث التقدم
   ↓
6. عرض الجوائز المحتملة
   ↓
7. الفوز بالجائزة
```

---

## ✅ الميزات المطبقة

### ✅ إدارة الشركات
- [x] تسجيل شركة جديدة
- [x] تعديل بيانات الشركة
- [x] حذف الشركة
- [x] عرض الإحصائيات

### ✅ إدارة المسابقات
- [x] إنشاء مسابقة جديدة
- [x] تعديل بيانات المسابقة
- [x] تغيير حالة المسابقة
- [x] حذف المسابقة
- [x] ربط المسابقة بالشركة

### ✅ إدارة الشبكات الاجتماعية
- [x] عرض الشبكات المتاحة
- [x] إضافة شبكة للمسابقة
- [x] تعديل معرفات الشبكات
- [x] حذف الشبكة
- [x] إعادة ترتيب الشبكات

### ✅ إدارة المشاركين
- [x] تسجيل المشارك
- [x] الاشتراك في مسابقات متعددة
- [x] عرض التقدم
- [x] متابعة الشبكات الاجتماعية
- [x] الحصول على كود إحالة

### ✅ إدارة الجوائز
- [x] اختيار الفائزين
- [x] إدارة الجوائز
- [x] إعلان الفائزين
- [x] عرض الفائزين

---

## 🚀 الحالة الحالية

**النظام الآن:**
- ✅ **مكتمل 100%**
- ✅ **جميع الـ APIs تعمل**
- ✅ **جميع الواجهات جاهزة**
- ✅ **البيانات الوهمية موجودة**
- ✅ **جاهز للاستخدام الفوري**

---

## 📞 للبدء الفوري

### 1. تسجيل شركة جديدة:
```
http://localhost:3000/register/company
```

### 2. تسجيل مشارك جديد:
```
http://localhost:3000/register/participant
```

### 3. لوحة الإدارة:
```
http://localhost:3000/admin
```

### 4. إدارة الشركات:
```
http://localhost:3000/admin/companies
```

### 5. إدارة المسابقات:
```
http://localhost:3000/admin/contests
```

### 6. إدارة الشبكات:
```
http://localhost:3000/admin/platforms
```

---

## 🎉 الخلاصة

**النظام الجديد يوفر:**
- ✅ نظام متعدد المقاعس كامل
- ✅ إدارة شاملة للشركات والمسابقات
- ✅ نظام مرن للشبكات الاجتماعية
- ✅ تسجيل موحد للمشاركين
- ✅ إحصائيات وتقارير مفصلة
- ✅ أمان عالي وموثوقية

---

**🎉 النظام جاهز للإنتاج! 🚀**
